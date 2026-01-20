# Board CRUD system

- 배포 URL: [https://vercel.com/juepark42gmailcoms-projects/v0-board-crud-system](https://vercel.com/juepark42gmailcoms-projects/v0-board-crud-system)

## 개발 흐름

- [V0로 초안 퍼블리싱](https://v0.app/chat/ttYU5YdmI1Q)
  - 리스트 페이지
  - 상세 페이지
  - 로그인 페이지

## 세팅

- V0 초안 기반으로 eslint, prettier등 세팅

## 누락된 기능 구현 및 개선 사항

- Claude Code, Copilot 보조 도구로 활용

1. 누락된 기능 구현 및 버그 수정
   - 리스트 페이지 - 무한 스크롤 로직 구현, 무한 스크롤 로딩 시 로딩 인디케이터가 보이지 않는 버그 수정
2. 사용하지 않는 라이브러리 제거
3. 코드 리팩토링
   - 중복 코드 재사용 가능하게 개선
   - 모듈화(컴포넌트 및 훅 분리)
   - 직접 작성된 코드 일부를 라이브러리로 대체하여 유지보수성 향상(예: date-fns, react-hook-form 등)

## 미사용 패키지 분석

### 제거 대상 패키지 (28개)

**폼 관련 (3개):**
- `react-hook-form` - 현재 useState로 폼 관리 중
- `@hookform/resolvers` - react-hook-form 의존
- `zod` - 스키마 검증 미사용

**UI 컴포넌트 (7개):**
- `embla-carousel-react` - 캐러셀 미사용
- `react-day-picker` - 날짜 선택 미사용
- `cmdk` - 명령 팔레트 미사용
- `input-otp` - OTP 입력 미사용
- `react-resizable-panels` - 리사이징 패널 미사용
- `vaul` - 드로어 미사용
- `recharts` - 차트 미사용

**Radix UI (16개):**
- `@radix-ui/react-accordion`
- `@radix-ui/react-aspect-ratio`
- `@radix-ui/react-avatar`
- `@radix-ui/react-checkbox`
- `@radix-ui/react-collapsible`
- `@radix-ui/react-context-menu`
- `@radix-ui/react-hover-card`
- `@radix-ui/react-label`
- `@radix-ui/react-menubar`
- `@radix-ui/react-navigation-menu`
- `@radix-ui/react-popover`
- `@radix-ui/react-progress`
- `@radix-ui/react-radio-group`
- `@radix-ui/react-scroll-area`
- `@radix-ui/react-slider`
- `@radix-ui/react-switch`
- `@radix-ui/react-tabs`
- `@radix-ui/react-toast`
- `@radix-ui/react-toggle`
- `@radix-ui/react-toggle-group`
- `@radix-ui/react-tooltip`

**기타 (2개):**
- `autoprefixer` - postcss.config.mjs에서 미사용
- `tailwindcss-animate` - tw-animate-css 사용 중

### 사용 중인 패키지

**Radix UI (6개):**
- `@radix-ui/react-dialog` - 게시글 작성/수정 모달
- `@radix-ui/react-select` - 카테고리 선택
- `@radix-ui/react-dropdown-menu` - 드롭다운 메뉴
- `@radix-ui/react-alert-dialog` - 삭제 확인
- `@radix-ui/react-separator` - 구분선
- `@radix-ui/react-slot` - Button 컴포넌트

**기타:**
- `@tanstack/react-table` - 게시글 테이블
- `date-fns` - 날짜 포맷팅
- `sonner` - 토스트 알림
- `swr` - 데이터 페칭
- `next-themes` - 테마 관리
- `lucide-react` - 아이콘
- `@vercel/analytics` - 분석
