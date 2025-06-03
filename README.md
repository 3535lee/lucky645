<<<<<<< HEAD
# Lucky645 - 로또 6/45 서비스

한국 로또 6/45 당첨번호 조회 및 추천 서비스

> 🚀 **Quick Start**: See [SETUP.md](./SETUP.md) for a simplified setup guide

## 🚀 주요 기능

- **번호 조회**: 1회부터 최신회까지 모든 당첨번호 조회
- **번호 검증**: 선택한 6개 번호가 1등에 당첨된 적이 있는지 확인
- **번호 추천**: 1등에 당첨된 적이 없는 번호 조합 추천
- **자동 업데이트**: 매주 토요일 7PM KST 자동으로 새 당첨번호 수집
- **다국어 지원**: 한국어, 영어, 인도네시아어
- **텔레그램 문의**: @lucky645bot을 통한 문의 시스템
- **PWA 지원**: 모바일 앱으로 설치 가능

## 🛠 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Features**: PWA, Multi-language, Web scraping, Telegram integration

## 🔐 보안 요구사항

이 프로젝트는 **엄격한 보안 관행**을 따릅니다:

- ✅ API 키나 자격 증명을 코드에 하드코딩하지 않음
- ✅ 모든 민감한 데이터는 환경 변수 사용
- ✅ 환경 변수 안전성 검증 함수 구현
- ✅ .gitignore에서 모든 .env 파일 제외
- ✅ 누락된 환경 변수에 대한 개발 경고

## 📦 설치 및 설정

### 1. 레포지토리 클론

```bash
git clone https://github.com/3535lee/lucky645.git
cd lucky645
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local.example` 파일을 `.env.local`로 복사하고 값을 설정하세요:

```bash
cp .env.local.example .env.local
```

필수 환경 변수:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 익명 키
- `TELEGRAM_BOT_TOKEN`: 텔레그램 봇 토큰
- `TELEGRAM_CHAT_ID`: 텔레그램 채팅 ID
- `CRON_SECRET`: Vercel Cron Job 보안 키

### 4. 데이터베이스 설정

Supabase에서 다음 테이블을 생성하세요:

```sql
CREATE TABLE lotto_results (
  round INTEGER PRIMARY KEY,
  date DATE NOT NULL,
  num1 INTEGER NOT NULL,
  num2 INTEGER NOT NULL,
  num3 INTEGER NOT NULL,
  num4 INTEGER NOT NULL,
  num5 INTEGER NOT NULL,
  num6 INTEGER NOT NULL,
  bonus INTEGER NOT NULL,
  first_prize BIGINT NOT NULL,
  first_winners INTEGER NOT NULL,
  second_prize BIGINT NOT NULL,
  second_winners INTEGER NOT NULL,
  third_prize BIGINT NOT NULL,
  third_winners INTEGER NOT NULL
);
```

### 5. 개발 서버 실행

```bash
npm run dev
```

## 🚀 배포

### Vercel 배포

1. Vercel에 프로젝트 연결
2. 환경 변수 설정
3. 자동 배포 완료

### 환경 변수 설정 (Vercel)

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `CRON_SECRET`

## 📱 PWA 설치

웹사이트 방문 후 브라우저에서 "홈 화면에 추가" 또는 "앱 설치" 옵션을 선택하세요.

## 🤖 텔레그램 봇 설정

1. @BotFather에게 `/newbot` 명령어로 새 봇 생성
2. 봇 토큰을 `TELEGRAM_BOT_TOKEN` 환경 변수에 설정
3. 봇과 대화를 시작하고 채팅 ID를 `TELEGRAM_CHAT_ID`에 설정

## 📊 자동 업데이트

매주 토요일 오후 7시(KST)에 자동으로 새로운 당첨번호를 수집합니다.
Vercel Cron Jobs를 사용하여 `/api/update-lotto` 엔드포인트를 호출합니다.

## 🔧 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run start`: 프로덕션 서버 실행
- `npm run lint`: ESLint 실행

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── api/               # API 라우트
│   ├── contact/           # 문의 페이지
│   ├── lookup/            # 번호 조회 페이지
│   ├── recommend/         # 번호 추천 페이지
│   └── verify/            # 번호 검증 페이지
├── components/            # 재사용 가능한 컴포넌트
├── lib/                   # 유틸리티 및 설정
│   ├── env-check.ts      # 환경 변수 검증
│   ├── i18n.ts           # 다국어 지원
│   ├── scraper.ts        # 웹 스크래핑
│   ├── supabase.ts       # Supabase 클라이언트
│   └── utils.ts          # 유틸리티 함수
└── types/                # TypeScript 타입 정의
```

## ⚠️ 보안 주의사항

- 절대로 API 키나 토큰을 코드에 하드코딩하지 마세요
- `.env.local` 파일을 Git에 커밋하지 마세요
- 프로덕션 환경에서는 적절한 환경 변수를 설정하세요
- 정기적으로 API 키를 회전하세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여

기여는 언제나 환영합니다! 이슈나 풀 리퀘스트를 통해 참여해주세요.

## 📞 문의

- **텔레그램 봇**: @lucky645bot
- **관리자**: +821024642501
- **웹사이트**: https://lucky645.xyz
=======
# lucky645
Lotto 6/45 support web service
>>>>>>> 5446e803c8ebe27c26b48c237ae29515fba83e46
