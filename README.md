# Board CRUD system

- 배포 URL: [https://vercel.com/juepark42gmailcoms-projects/v0-board-crud-system](https://vercel.com/juepark42gmailcoms-projects/v0-board-crud-system)
 
## 프로젝트 실행 방법
```aiignore
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 실행
pnpm start
```
## 사용한 기술 스택
Next.js 16 | React 19 | TypeScript 5

- 코드 퀄리티 관리
  - ESLint
  - Prettier
- 스타일
  - Tailwind CSS
  - Radix UI
- 배포
  - Vercel
- 데이터 페칭
  - SWR
- 기타
  - chart.js(차트)
  - react-chartjs-2(차트js 리액트 wrapper)
  - @tanstack/react-table(게시판)

## 주요 기능
주요 구현 기능 요약
### 로그인
  * 로그인/로그아웃 
  * 로그인하지 않은 유저는 대시보드 및 게시글 CRUD 접근 불가
  * 토큰을 로컬 스토리지에 저장

### 게시글 CRUD
  * 게시글 목록 페이징, 검색, 정렬
    * 무한 스크롤 방식으로 게시글 로드
    * 카테고리/검색어에 따른 필터링
    * 각 컬럼 숨기기/보이기 가능
    * 각 컬럼 너비 조절 가능
    * 제목 오름차순/내림차순, 최신순/오래된순 정렬 가능
    * 게시글 작성 가능(모달)
    * action 컬럼 > 버튼을 통해 삭제 가능
  * 게시글 상세 페이지
    * 수정/삭제 가능(모달)

### 대시보드
  * 탭으로 구분된 차트 대시보드. 각 탭을 선택하여 차트 확인 가능
  1. 브랜드 탭
     * 주제: Top 커피 브랜드, 인기 스낵 브랜드
     * Chart: Bar Chart, Doughnut Chart
  2. 주간 트렌드 탭:
     * 주제: 주간 기분 트렌드, 주간 운동 트렌드 
     * Chart: Stacked Bar Chart, Stacked Area Chart
  3. 커피 소비 탭
     * 주제: 커피 소비량과 버그, 생산성의 상관관계
     * Chart: Multi-line Chart
  4. 스낵 영향 탭:
     * 주제: 스낵 개수와 회의 불참, 사기의 상관관계
     * Chart: Multi-line Chart

* 차트 기능
  * 범례를 통해서 특정 데이터 시리즈 토글 가능
  * 범례를 통해서 색상 변경 가능
  * 마우스 오버 시 툴팁으로 데이터 확인 가능

## 개발 흐름

### 초안 퍼블리싱
- V0로 초안 퍼블리싱

### 세팅
- V0 초안 기반으로 eslint, prettier, tsconfig 등 프로젝트 세팅 조정

### 누락된 기능 구현 및 개선 사항
- Claude Code, Copilot 보조 도구로 활용
- Editor: Webstorm
 
1. 누락된 기능 구현 및 버그 수정
2. 사용하지 않는 라이브러리 제거
3. 코드 리팩토링
   - 중복 코드 재사용 가능하게 개선
   - 모듈화(컴포넌트 및 훅 분리)
   - 직접 작성된 코드 일부를 라이브러리로 대체하여 유지보수성 향상(예: date-fns 등)
