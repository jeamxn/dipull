<p align="center">
  <img src="./public/public/logo_text.svg" height="50px">
  <p align="center"><b><i>Dipull :: 한국디지털미디어고등학교 인트라넷의 새 이름</i></b></p>
</p>

# 1. 디풀

[한국디지털미디어고등학교](https://dimigo.hs.kr/)에서 사용하는 인트라넷입니다.

개발에 참여하고 싶다면 디풀 개발자 커뮤니티에 가입해주세요.

[Discord 디풀 개발자 커뮤니티에 가입하기
](https://discord.gg/U7FBXyPKM6)

# 2. 설정

이 프로그램은 Next.JS로 작성되었습니다.

## 1) 환경 설정

### ① Node.js
`node v20.13.1`으로 개발되었습니다.
> [`nvm`](https://github.com/nvm-sh/nvm) 사용을 권장합니다.

### ② Bun
[`bun`](https://bun.sh)을 사용합니다. `v1.1.9`

### ③ Database (MongoDB)

DB로는 `MongoDB`을 사용합니다. [`설치 가이드 (공식 홈페이지)`](https://www.mongodb.com/ko-kr/docs/manual/installation/)

> `Local`에 직접 설치하지 않고 `Docker`를 사용하여 설치하는 것을 권장합니다. [`설치 가이드 (Docker)`](https://hub.docker.com/_/mongo)
> ```bash
> # MongoDB Docker 이미지 다운로드
> docker pull mongo
> # MongoDB Docker 컨테이너 실행
> docker run -d -p 27017:27017 --name mongodb mongo
> ```
> ```bash
> # MongoDB Docker 컨테이너 중지
> docker stop mongodb
> ```
> 
> ```bash
> #  MongoDB Docker 컨테이너 시작
>docker start mongodb
> ```
> 
> ```bash
> # MongoDB Docker 컨테이너 재시작
> docker restart mongodb
> ```

### ④ VScode 확장 프로그램
VScode 실행 후, Extensions 탭에서 아래의 확장 프로그램을 설치해주세요.

> Extensions 탭에서 검색창에 `@recommended`를 입력하면 아래의 확장 프로그램을 한번에 설치할 수 있습니다.

> 또는 VScode에서 `Ctrl + Shift + P`를 누르고 `Show Recommended Extensions`를 입력해주세요.

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "christian-kohler.npm-intellisense",
    "dbaeumer.vscode-eslint",
    "github.copilot",
    "github.vscode-pull-request-github",
    "naumovs.color-highlight",
    "PKief.material-icon-theme",
  ]
}
```

### ⑤ VScode 설정

VScode 실행 후, `settings.json`을 열어 아래의 설정을 추가해주세요.

> [`.vscode/settings.json`](./.vscode/settings.json)에 추가되어 있어서 따로 추가할 필요가 없을 수 있습니다.

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.tabSize": 2,
  "editor.formatOnType": true,
  "workbench.iconTheme": "material-icon-theme"
}

```

### ⑥ 패키지 설치

개발 시작 전 아래의 명령어를 입력하여 필요한 모듈을 설치해주세요.

```bash
bun install
```

### ⑦ 환경 변수 설정

`.env` 파일을 생성하고 [`.env.example`](./.env.example)의 내용을 추가해주세요.

#### 필수 항목
- `MONGODB_URI` 연결할 MongoDB의 URI
- `NEXT_PUBLIC_DIMIGOIN_KEY` [디미고인 API 키](https://auth.dimigo.net/developers/add)
- `JWT_SECRET` JWT 토큰 생성 시 사용할 시크릿 키
- `CRON_SECRET` Cron 작업 시 사용할 시크릿 키

#### 기본 값 유지
- `NEXT_PUBLIC_DIMIGOIN_URI` 디미고인 API URI

#### 해당 기능 사용 시
- `YOUTUBE_API_KEY` 기상송 검색 시 사용할 Youtube API 키 (GCP 발급)
- `TEACHERS_CODE` 구글 Sheets API 사용 시 사용할 인증 코드


### ⑧ DB 초기화

```bash
bun db_init
```
위 명령어를 입력하여 DB를 초기화해주세요.



# 3. 개발

## 1) 개발 서버 실행

개발을 시작하기 전에 아래의 명령어를 입력하여 개발 서버를 실행해주세요.

```bash
bun dev
```

개발 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 결과를 확인할 수 있습니다.

`src/` 폴더 안의 소스코드를 수정하여 페이지를 수정할 수 있습니다. 파일을 수정할 때마다 페이지가 자동으로 업데이트됩니다.

## 2) 빌드

아래의 명령어를 입력하여 프로젝트를 빌드할 수 있습니다.

```bash
bun build
```

## 3) 배포

Github의 `Main` 브랜치에 `Merge`하면 `Vercel`을 통해 자동으로 배포됩니다.

여러분들은 권한이 없기 때문에 `Main` 브랜치에 `Push` 및 배포를 직접 할 수 없습니다.

또한 `Main` 브랜치에 직접 `Push`하지 않고 `Github Pull Request`를 통해 `Merge`를 요청해주세요.
