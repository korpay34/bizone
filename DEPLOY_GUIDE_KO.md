# BizOne Cloudflare 배포 안내

이 프로젝트는 `korpay34/bizone` GitHub 저장소와 Cloudflare Workers를 연결하여 배포합니다.

## 준비된 항목

- Worker 이름: `bizone`
- 임시 주소: `https://bizone.korpay.workers.dev`
- D1 데이터베이스: `bizone-db`
- D1 데이터베이스 ID: `366fa980-9b86-4777-a4de-f1f5ae900522`
- Turnstile 위젯: `bizone-admin-login`

## 배포 순서

1. 이 ZIP의 내용물을 GitHub `korpay34/bizone` 저장소 최상위에 올립니다.
2. Cloudflare의 `bizone` Worker에서 GitHub 저장소를 연결합니다.
3. 빌드 명령은 `npm run build`, 배포 명령은 `npx wrangler deploy`로 설정합니다.
4. D1 콘솔에서 `database-setup.sql`의 전체 내용을 한 번 실행합니다.
5. Worker 설정에서 D1 바인딩 이름을 `DB`로 연결합니다.
6. Worker 변수 및 비밀 값에 관리자 로그인 관련 5개 값을 등록합니다.

## 관리자 로그인 변수

| 이름 | 종류 | 설명 |
|---|---|---|
| `ADMIN_USERNAME` | 비밀 값 권장 | 관리자 아이디 |
| `ADMIN_PASSWORD` | 비밀 값 | 충분히 긴 관리자 비밀번호 |
| `SESSION_SECRET` | 비밀 값 | 32자 이상의 무작위 문자열 |
| `TURNSTILE_SITE_KEY` | 일반 변수 또는 비밀 값 | Turnstile 사이트 키 |
| `TURNSTILE_SECRET_KEY` | 비밀 값 | Turnstile 비밀 키 |

실제 비밀번호와 비밀 키는 GitHub 파일에 입력하지 않습니다.

## 자료실 첨부파일

R2를 사용하지 않기 때문에 파일은 `static-src/downloads` 폴더에 올립니다. 배포가 끝난 뒤 관리자 페이지에서 `/downloads/파일명` 형식으로 연결합니다.
