# lucky645 — 운영 가이드

한국 로또 6/45 당첨번호 조회·추천 웹사이트. Next.js 15 (App Router) + TypeScript + Tailwind v4. PWA, 다국어(한/영/인니), Telegram 문의 연동.

> 비밀값(키·토큰)은 이 파일에 기록하지 않음. 실제 값은 로컬 `.env.local` 및 Vercel 환경변수에 있음.

## 배포 (Vercel)

- **방식**: GitHub `main` 푸시 시 Vercel 자동 배포 (CI 워크플로 없음, `git push origin main`이 곧 배포)
- **GitHub**: `https://github.com/3535lee/lucky645.git` (계정 `3535lee`)
- **Vercel 프로젝트**: name `lucky645`, projectId `prj_1MKPxngFIyBP8EMXuHeEjhK1Y0rS`, orgId `team_9gnm50Z0pKi2hbmNrqO100QK` (`.vercel/project.json`)
- **리전**: `sin1` (싱가포르) — `vercel.json`
- 배포 계정: Vercel 대시보드는 GitHub `3535lee` 연결 계정으로 로그인

## 데이터베이스 (Supabase)

- **프로젝트 ref**: `mtpbbikeeksykvxzkblv` — URL `https://mtpbbikeeksykvxzkblv.supabase.co`
- **클라이언트 초기화**: `src/lib/supabase.ts`, `src/lib/supabase-client.ts`
- **환경변수** (`.env.local`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`(클라이언트), `SUPABASE_SERVICE_ROLE_KEY`(서버)
- **메인 테이블**: `lotto_results` (`round` PK, `date`, `num1`~`num6`, `bonus`, 1/2/3등 상금·당첨자수). 스키마: `database-setup.sql`
- 기타 테이블: `exchange_rates` (환율)

## 주간 크론 — 당첨번호 자동 수집

Vercel Cron으로 매주 자동 갱신 (`vercel.json`):

- **`/api/update-lotto`** — `0 13 * * 6` = **토요일 13:00 UTC (KST 22:00, 추첨 직후)**
  - 핸들러: `src/app/api/update-lotto/route.ts` (GET=Vercel cron 트리거, POST=Bearer `CRON_SECRET` 인증)
  - **데이터 출처**: 네이버 검색 스크래핑 — `https://search.naver.com/search.naver`에서 "{회차}회 로또당첨번호" 검색, cheerio로 `.winning_number .ball` / `.bonus_number .ball` 파싱
- **`/api/update-rates`** — `0 8 * * *` = 매일 08:00 UTC, 환율 갱신

> 크론 상세(스크래핑 로직·회차 보정·수동 트리거·환율): [`docs/cron.md`](docs/cron.md)

## 로컬 개발

```bash
npm run dev      # Turbopack 개발 서버
npm run build    # 프로덕션 빌드
npm start
```
`.env.local`(미커밋)에 Supabase·Telegram·CRON_SECRET 값 필요. 셋업: `SETUP.md`.

## 기타 환경변수 (`.env.local`)

- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — 문의 폼 → 텔레그램 알림
- `CRON_SECRET` — 크론 엔드포인트 인증
- `NEXT_PUBLIC_GA_ID` — Google Analytics (선택)
