# Supabase keep-alive

Supabase Free는 7일간 활동이 적은 프로젝트를 정지할 수 있다. 이 작업은 정지 방지를 **보장하지 않는다**. [Supabase 공식 안내](https://supabase.com/docs/guides/platform/going-into-prod#availability)는 저활동 판정에 충분한 요청 횟수나 쓰기 횟수를 보장하지 않는다.

## 구성

- `vercel.json`: `/api/keepalive`, `0 2 * * 0-5` (일~금 02:00 UTC = 11:00 KST; 토요일 제외). Vercel Hobby는 해당 시각부터 한 시간 이내에 실행할 수 있다.
- `src/app/api/keepalive/route.ts`: Vercel Cron의 `GET` 호출을 `Authorization: Bearer <CRON_SECRET>`으로 인증한 후 서비스 역할로 RPC를 호출한다. 응답은 캐시하지 않는다.
- `migrations/002_keepalive_write_probe.sql`: 별도 `lucky645_keepalive_probe` 테이블에 임시 행을 넣고 해당 행만 삭제하는 `lucky645_keepalive_write()` RPC를 생성한다. 삽입과 삭제는 한 트랜잭션이므로 실패 시 롤백된다. 실제 로또 데이터는 변경하지 않는다.
- 테이블 접근과 RPC 실행은 `service_role`에만 허용한다. 서비스 역할 키는 서버 전용이며 클라이언트나 로그에 노출해서는 안 된다.
- 토요일 로또 갱신은 기존 `/api/update-lotto` 크론이 담당한다. 이 작업의 성공 여부는 별도 확인해야 한다.

## 배포 및 확인

1. Supabase에 `migrations/002_keepalive_write_probe.sql`을 적용한다. 기존 테이블이나 함수를 덮어쓰지 않도록 동일한 이름이 있으면 중단한다.
2. Vercel Production에 `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, 충분히 긴 무작위 `CRON_SECRET`을 설정한다. Vercel은 Cron 호출에 이 시크릿을 자동으로 전달한다. 환경변수를 바꾼 뒤에는 재배포가 필요하다.
3. 배포 후 Vercel 대시보드의 Cron Jobs에서 `/api/keepalive` 수동 실행 및 로그를 확인한다. 성공은 `{"success":true,...}`, 실패는 HTTP 500이다. 인증이 없거나 틀리면 401이다.
4. 확인용 수동 호출이 필요한 경우 시크릿을 안전하게 환경변수로 설정하고 아래 명령을 실행한다. 시크릿 값을 코드나 셸 명령에 직접 기록하지 않는다.

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://lucky645.vercel.app/api/keepalive
```

Cron 호출 실패는 Vercel이 자동 재시도하지 않는다. Supabase가 이미 정지된 경우 이 작업만으로 자동 재개할 수 없다. 실행 실패 또는 장기간 실행 누락을 발견하려면 별도의 외부 모니터링이 필요하다.
