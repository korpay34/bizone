# BizOne 홈페이지

BizOne 회사 홈페이지와 공지사항·자료실 관리자 기능을 제공하는 Cloudflare Worker 프로젝트입니다.

## 사용 서비스

- Cloudflare Workers: 홈페이지 및 관리자 페이지
- Cloudflare D1: 공지사항·자료실 게시글
- Cloudflare Turnstile: 관리자 로그인 자동입력 방지
- GitHub: 소스 코드와 자료실 다운로드 파일

## 비밀 설정

아래 값은 GitHub 코드에 입력하지 않고 Cloudflare Worker의 변수 및 비밀 값에서 설정합니다.

- `ADMIN_USERNAME`: 관리자 아이디
- `ADMIN_PASSWORD`: 관리자 비밀번호
- `SESSION_SECRET`: 로그인 쿠키 서명용 긴 무작위 문자열
- `TURNSTILE_SITE_KEY`: Turnstile 사이트 키
- `TURNSTILE_SECRET_KEY`: Turnstile 비밀 키

## 장비 챗봇 연동

`wrangler.jsonc` 의 `vars.CHATBOT_URL` 에 챗봇(bizone-chatbot) 주소를 넣으면 Worker 가 켭니다. 비워 두면 아무것도 나타나지 않습니다.

- 관리자 화면을 뺀 모든 HTML 페이지에 챗봇 플로팅 버튼(`widget.js`)을 자동으로 넣습니다.
- 고객센터에 '장비 셀프해결' 탭(`/support/?tab=selfhelp`)이 나타나고, 본문에 챗봇이 크게 열립니다.
- 상품 카드의 '이 모델 문제 해결하기'는 위젯이 있으면 그 자리에서 챗봇을 열고, 없으면 셀프해결 탭으로 이동합니다.
- 챗봇 쪽 `ALLOWED_ORIGINS` 에 홈페이지 주소를 등록해야 위젯이 동작합니다.
- 로컬은 `.dev.vars` 에 `CHATBOT_URL=http://localhost:8788` 을 넣습니다.

## 자료실 파일 등록

1. 다운로드할 파일을 `static-src/downloads` 폴더에 올립니다.
2. GitHub에 반영하여 배포가 완료될 때까지 기다립니다.
3. 관리자 페이지에서 파일명을 입력합니다.
4. 첨부파일 주소에는 `/downloads/파일명`을 입력합니다.

R2를 사용하지 않으므로 결제수단 등록 없이 운영할 수 있습니다.
최초 배포 연결 완료


## 2026-10-14 홈페이지 교체

승인된 새 홈페이지를 `static-src`에 적용했습니다. 루트 주소는 새 메인화면이며 회사소개, 도입사례, 코페이장부, 개인정보 처리방침도 함께 제공됩니다.

- 기존 Cloudflare Worker 이름 `bizone`과 자동배포 저장소를 유지합니다.
- 기존 D1 `bizone-db`, 관리자 로그인 설정, 게시판 API 및 게시글을 유지합니다.
- 사진은 Worker 코드에 포함하지 않고 Workers Static Assets로 제공합니다.
- `npm run build`로 `dist/worker.js`와 `dist/assets`를 생성합니다.
- `npm run validate`로 새 홈페이지와 기존 관리자/게시판 경로를 검사합니다.
- 이전 소스는 `backup/pre-renewal-20261014` 브랜치에 있습니다.

관리자: `/admin/`
공지사항: `/support/notices/`
자료실: `/support/resources/`
FAQ 및 문의게시판: `/support/faq/`

DB 초기화나 마이그레이션은 홈페이지 교체 과정에서 실행하지 않습니다. 기존 Cloudflare 환경변수와 비밀 설정을 그대로 사용합니다.
