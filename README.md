# Lucky645 - 로또 6/45 서비스

한국 로또 6/45 당첨번호 조회 및 추천 서비스

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
