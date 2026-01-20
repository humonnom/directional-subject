# Board CRUD System

> Next.js 16 기반의 게시판 CRUD 및 데이터 시각화 대시보드

## 🔗 Links

- **배포 URL**: https://v0-board-crud-system.vercel.app
- **개발 기간**: 2026.01.20 ~ 2026.01.21

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [개발 과정](#-개발-과정)

## 🎯 프로젝트 소개

V0.dev로 초안을 생성한 후, Next.js 16과 React 19를 활용하여 완성한 게시판 CRUD 시스템입니다.
게시글 CRUD, 인터랙티브한 데이터 대시보드 기능을 제공합니다.

### 주요 특징

- 🔐 로컬스토리지를 활용한 JWT 기반 인증
- 📊 Chart.js를 활용한 인터랙티브 데이터 시각화
- 📱 반응형 UI/UX (Radix UI + Tailwind CSS)
- ♿ 접근성을 고려한 컴포넌트 설계
- ⚡ SWR을 활용한 효율적인 데이터 페칭

## ✨ 주요 기능

### 1. 인증 시스템
- 로그인/로그아웃 기능
- JWT 토큰 기반 인증 (로컬 스토리지)
- 비인증 사용자 접근 제한 (대시보드, 게시글 CRUD)

### 2. 게시글 관리

**목록 페이지**
- 무한 스크롤 방식의 게시글 로딩
- 카테고리/검색어 필터링
- 다중 정렬 옵션 (제목, 날짜 기준 오름차순/내림차순)
- 컬럼 숨기기/보이기 및 너비 조절
- 모달 기반 게시글 작성
- 삭제 기능

**상세 페이지**
- 게시글 조회
- 모달 기반 수정/삭제

### 3. 데이터 대시보드

탭 기반 차트 대시보드로 다양한 데이터를 시각화합니다.

| 탭 | 주제 | 차트 유형 |
|---|---|---|
| 브랜드 | Top 커피 브랜드, 인기 스낵 브랜드 | Bar Chart, Doughnut Chart |
| 주간 트렌드 | 주간 기분/운동 트렌드 | Stacked Bar Chart, Stacked Area Chart |
| 커피 소비 | 커피 소비량과 버그, 생산성 상관관계 | Multi-line Chart |
| 스낵 영향 | 스낵 개수와 회의 불참, 사기 상관관계 | Multi-line Chart |

**차트 인터랙션**
- 범례 클릭으로 데이터 시리즈 토글
- 범례 색상 커스터마이징
- 호버 시 상세 데이터 툴팁 표시

## 🛠 기술 스택

### Core
- **Next.js** 16.0.10 - App Router 기반 풀스택 프레임워크
- **React** 19.2.0 - UI 라이브러리
- **TypeScript** 5.1.0 - 타입 안정성

### UI/Styling
- **Tailwind CSS** 4.1.9 - 유틸리티 우선 CSS
- **Radix UI** - 접근성 고려 헤드리스 컴포넌트
    - Dialog, Dropdown Menu, Select, Tabs 등
- **Lucide React** - 아이콘
- **class-variance-authority** - 조건부 스타일링
- **Sonner** - 토스트 알림
- **next-themes** - 다크모드 지원

### Data Management
- **SWR** 2.3.8 - 데이터 페칭, 캐싱, 재검증
- **TanStack Table** 8.21.3 - 테이블 상태 및 기능 관리

### Visualization
- **Chart.js** 4.5.1 - 차트 렌더링
- **react-chartjs-2** 5.3.1 - Chart.js React 래퍼

### Development Tools
- **ESLint** 9.39.2 + **Prettier** 3.8.0 - 코드 품질 및 포맷팅
- **TypeScript ESLint** - 타입스크립트 린팅

### Deployment
- **Vercel** - 호스팅 및 배포

### Utilities
- **date-fns** 4.1.0 - 날짜 처리
- **clsx** / **tailwind-merge** - 클래스명 병합

## 🚀 시작하기

### 필수 요구사항

- Node.js 18 이상
- pnpm (권장)

### 설치 및 실행
```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (http://localhost:3000)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

### 추가 스크립트
```bash
# 린트 검사
pnpm lint

# 린트 자동 수정
pnpm lint:fix

# 코드 포맷팅
pnpm format

# 포맷팅 검사
pnpm format:check
```

## 📁 프로젝트 구조
```
├── app/                 # Next.js App Router
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # UI 기본 컴포넌트 (Radix UI 기반)
│   └── ...
├── hooks/              # 커스텀 훅
├── lib/                # 유틸리티 함수
├── public/             # 정적 파일
└── styles/             # 전역 스타일
```

## 💡 개발 과정

### 1. 초안 생성
- **V0.dev**로 UI 초안 빠르게 프로토타이핑

### 2. 프로젝트 세팅
- V0 초안을 기반으로 프로젝트 환경 구성
- ESLint, Prettier, tsconfig 커스터마이징
- 개발 환경: **WebStorm** + **Claude Code** + **GitHub Copilot**

### 3. 기능 구현 및 개선

**개발 작업**
1. 누락된 기능 구현 및 버그 수정
2. 불필요한 의존성 제거
3. 코드 품질 개선
    - 중복 코드 제거 및 재사용성 향상
    - 컴포넌트 및 커스텀 훅 모듈화
    - 유틸리티 라이브러리 도입으로 유지보수성 향상

**AI 도구 활용**
- Claude Code: 복잡한 로직 구현 및 리팩토링 지원
- Copilot: 코드 자동 완성 및 보일러플레이트 생성

## 📄 License

MIT

---

**개발자**: 박주은 | juepark42@gmail.com