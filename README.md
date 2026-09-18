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

## 자료실 파일 등록

1. 다운로드할 파일을 `static-src/downloads` 폴더에 올립니다.
2. GitHub에 반영하여 배포가 완료될 때까지 기다립니다.
3. 관리자 페이지에서 파일명을 입력합니다.
4. 첨부파일 주소에는 `/downloads/파일명`을 입력합니다.

R2를 사용하지 않으므로 결제수단 등록 없이 운영할 수 있습니다.
