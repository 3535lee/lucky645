# Cron Jobs — 상세

Vercel Cron으로 두 개의 스케줄 작업이 돌아간다. 설정은 [`vercel.json`](../vercel.json), 리전은 `sin1`(싱가포르).

```json
"crons": [
  { "path": "/api/update-lotto", "schedule": "0 13 * * 6" },
  { "path": "/api/update-rates", "schedule": "0 8 * * *" }
]
```

> Vercel Cron은 항상 **GET**으로 호출한다. 두 라우트 모두 GET 핸들러가 진입점이며 인증 없이 동작한다(공개 GET 트리거).

---

## 1. 로또 당첨번호 수집 — `/api/update-lotto`

| 항목 | 값 |
|---|---|
| 스케줄 | `0 13 * * 6` = **매주 토요일 13:00 UTC = KST 22:00** (추첨 직후) |
| 라우트 | [`src/app/api/update-lotto/route.ts`](../src/app/api/update-lotto/route.ts) |
| 핵심 로직 | [`src/lib/scraper.ts`](../src/lib/scraper.ts) → `updateLottoDatabase()` |
| 데이터 출처 | **네이버 검색** `https://search.naver.com/search.naver` |
| 대상 테이블 | Supabase `lotto_results` |

### 동작 흐름 (`updateLottoDatabase`)

1. `getLatestRound()` — DB의 최신 회차 조회.
2. `최신회차 + 1` 부터 **최대 +30회차**까지 순회하며 네이버에서 스크래핑.
3. 결과가 있으면 `lotto_results`에 `insert`, 없으면 즉시 중단(`break`).
   - 즉 빠진 과거 회차까지 한 번에 메꿀 수 있음(누락 보정).
4. 삽입 0건이면 "이미 최신" 메시지 반환.

### 네이버 스크래핑 (`scrapeFromNaver`)

- 쿼리: `"{회차}회 로또당첨번호"` (예: `1175회 로또당첨번호`), `cheerio`로 HTML 파싱.
- **회차 검증**: 페이지의 `(\d+)회차 (` 패턴이 요청 회차와 다르면 `null` 반환(미추첨/오매칭 방지).
- 당첨번호: `.winning_number .ball` 6개, 보너스: `.bonus_number .ball`.
- 상금: `th[scope="row"]`에서 `1등/2등/3등` 행을 찾아 총 당첨금과 당첨자수 파싱.
  - 당첨자수 라벨은 신규 회차 `당첨 복권수`, 구 회차 `당첨게임 수` 둘 다 지원.
  - 1등 파싱 실패 시 `.win_text`(1인당 금액 × 당첨자수)로 폴백.
- 추첨일은 스크래핑하지 않고 계산: **1회 = 2002-12-07**, 이후 7일 간격(`getDrawDate`).

> ⚠️ **당첨금액 규칙 (중요)**
> `lotto_results`의 `*_prize_amount`에는 **각 등수의 총 당첨금**(1·2·3등 전체 합계 금액)을 저장한다.
> 네이버 페이지에 표시된 **"1인당 당첨금액"을 직접 가져오지 말 것.**
> 1인당 금액은 표시 시점에 **`총 당첨금 ÷ 당첨 인원수`**로 계산한다.
> (1등 폴백 경로처럼 1인당 값만 잡혔다면 `× 당첨자수`로 총액을 복원해 저장해야 함.)

### POST (수동/보안 트리거)

GET 외에 **POST**도 있음. `Authorization: Bearer <CRON_SECRET>` 필요.
```bash
curl -X POST https://<도메인>/api/update-lotto \
  -H "Authorization: Bearer $CRON_SECRET"
```
> 주의: 현재 `.env.local`의 `CRON_SECRET`은 placeholder(`your_r...`)일 수 있음. POST 인증을 쓰려면 실제 값을 Vercel 환경변수와 맞춰야 함. (Vercel cron 자체는 GET이라 영향 없음.)

### 관련 테스트 라우트

- [`src/app/api/test-update-lotto/route.ts`](../src/app/api/test-update-lotto/route.ts) — 업데이트 수동 테스트
- [`src/app/api/crawl-test/route.ts`](../src/app/api/crawl-test/route.ts) — 스크래핑 단독 테스트

---

## 2. 환율 수집 — `/api/update-rates`

| 항목 | 값 |
|---|---|
| 스케줄 | `0 8 * * *` = **매일 08:00 UTC = KST 17:00** |
| 라우트 | [`src/app/api/update-rates/route.ts`](../src/app/api/update-rates/route.ts) |
| 핵심 로직 | [`src/lib/exchange.ts`](../src/lib/exchange.ts) → `updateExchangeRates()` |
| 데이터 출처 | **네이버 금융** `finance.naver.com/marketindex/...` (USD, IDR) |
| 대상 테이블 | Supabase `exchange_rates` |

### 동작

- 대상 통화: `USD`(1단위 기준), `IDR`(100단위 기준).
- 네이버 환율 상세 페이지는 **EUC-KR** 인코딩 → `TextDecoder('euc-kr')`로 디코딩.
- `"현찰 사실때"`(현찰 매입) 환율을 정규식으로 추출해 `exchange_rates`에 upsert.

---

## 운영 메모

- 두 작업 모두 외부(네이버) HTML 구조에 의존 → 네이버 마크업 변경 시 스크래핑이 깨질 수 있음. 실패 시 Vercel Functions 로그(`[Scraper]`, `[UpdateDB]`, `[Rates]` 프리픽스)에서 확인.
- 수동 재실행: 브라우저/`curl`로 GET 엔드포인트 직접 호출하면 됨.
- 스케줄 변경은 `vercel.json` 수정 후 `git push origin main`(자동 배포)로 반영.
