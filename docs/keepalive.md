# Supabase keep-alive — pause 방지

Supabase Free 플랜은 **7일간 DB 접속이 없으면 프로젝트를 pause**시킨다.
접속자가 적을 때도 pause되지 않도록 **3일에 한 번** Vercel Cron으로 가벼운 DB 접근을 수행한다.

## 구성

`vercel.json`에 전용 크론 추가 (기존 3개 + 1개 = 총 4개):

```json
{ "path": "/api/keepalive", "schedule": "0 2 */3 * *" }
```

- **스케줄**: `0 2 */3 * *` = 매월 1·4·7·10·…일 02:00 UTC 실행 (최대 간격 3일, pause 기준 7일 대비 여유 있음)
- **라우트**: [`src/app/api/keepalive/route.ts`](../src/app/api/keepalive/route.ts) — `GET`
- **동작**: `lotto_results`에서 최신 회차 1건만 SELECT (읽기 전용, anon key, 별도 환경변수 불필요)
- **응답**: `{"success":true,"latestRound":...,"at":...}`

> 참고: `/api/update-rates`가 **매일** Supabase에 upsert하므로 평상시에는 이미 pause 조건을 충족한다.
> `/api/keepalive`는 환율 스크래핑(네이버 의존)과 무관하게 **DB 접속 자체를 보장**하는 전용 안전망이다.
> Vercel Cron은 항상 **GET**으로 호출하며, 이 라우트는 기존 크론들과 동일하게 인증 없이 동작한다.

## 동작 확인

```bash
# 로컬
curl http://localhost:3000/api/keepalive

# 프로덕션 (Vercel URL)
curl https://<vercel-url>/api/keepalive
```

`{"success":true,"latestRound":...}` 형태면 정상.
Cron 실행 이력은 Vercel Dashboard > 프로젝트 > Cron Jobs에서 확인.

## 스케줄 변경

`vercel.json`의 `schedule` 수정 후 `git push origin main`(자동 배포)으로 반영.
7일보다 여유 있게 **3일 간격 유지 권장**.
