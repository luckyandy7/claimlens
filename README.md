# ClaimLens · 클레임렌즈

출고 사진과 고객 제출 사진을 주문별로 연결하고, OpenAI 사진 분석으로 담당자의 반품·보증 검토를 돕는 로컬 웹앱입니다.

## 시작하기

Node.js **22.13 이상** 및 npm이 필요합니다. `node:sqlite` 사용에 따른 experimental 경고가 나올 수 있습니다.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

http://localhost:3000 에 접속해 **직접 경험하기**를 누르면 독립된 데모 작업공간이 생성됩니다.

## OpenAI 설정

`.env.local`을 열고 본인 키를 로컬에서 입력하세요.

```dotenv
OPENAI_API_KEY=여기에_본인_API_키
OPENAI_MODEL=gpt-4.1-mini
```

변경 후 서버를 재시작하세요. 키는 서버 전용이며 브라우저에 전달하지 않습니다. `.env.local`과 DB는 Git에서 제외됩니다. 모델은 이미지 입력과 Responses API의 Structured Outputs를 지원하는, 본인 계정에서 이용 가능한 모델로 변경할 수 있습니다. ChatGPT 구독과 API 과금은 별도입니다.

**접수 상세 → AI 사진 비교 → AI 분석 실행**을 누르면 최대 8장의 사진을 JPEG로 변환·축소해 OpenAI로 전송합니다. 자동 실행하지 않으며 클릭 시 API 비용이 발생합니다. 관찰 내용·불확실성·추가 사진 제안을 저장합니다. `store:false`를 사용하지만 이것이 OpenAI의 모든 데이터 보존이 없음을 의미하지는 않습니다.

사진 속 문구를 명령으로 취급하지 않도록 지시하고 JSON 스키마와 서버 검증을 적용합니다. 결과는 부정확할 수 있으므로 담당자가 검토해야 합니다. 사기·책임·손상 시점·내부 고장·환불 승인 여부를 확정하는 용도로 사용하지 않습니다.

### 사용 순서

1. 데모 작업공간 열기 → 새 접수 생성.
2. 출고 사진 등록 → 고객 제출 링크 발급.
3. 링크를 별도 탭에서 열어 사진 3장 제출.
4. 원래 상세 화면 새로고침 → AI 분석 실행.
5. 사진과 AI 결과를 검토 → 처리 사유 작성 → 검토 완료 또는 추가 자료 요청.

기본 데모의 두 사진은 동일한 예시 그림입니다. 실제 비교는 직접 등록한 사진으로 확인하세요. 분석 중 사진/접수가 변경되면 결과 저장을 거부하고 재분석을 요청합니다. 프로세스 내 작업공간당 동시 분석 1건, 최소 15초 간격, 60초 요청 제한을 적용합니다. 다중 서버용 분산 제한은 아직 없습니다.

## 기능과 디자인

- 사진 접수·업로드·제출 링크(72시간)·비교·확대·처리 이력
- 쿠키 세션별 작업공간 분리 및 비공개 사진 접근 검사
- OpenAI Responses API 사진 비교 및 구조화된 결과 저장
- 크림·검정·올리브 색상, 격자와 대형 타이포, 버튼 피드백·공유 이미지 전환·확대 모션
- 모바일 대응과 모션 감소/중지 설정
- 랜딩의 외부 조사 수치와 가정 기반 계산기를 구분 표시

## Figma용 로고

- [로고 전체 SVG](public/brand/claimlens-editable.svg)
- [아이콘 SVG](public/brand/claimlens-icon.svg)

SVG를 Figma 캔버스로 드래그하세요. 아이콘과 워드마크는 그룹으로 분리되어 있으며 내부 Vector를 선택해 **Fill**을 변경할 수 있습니다. 배경 사각형이나 내장 비트맵은 없습니다. 글자는 폰트 없이 사용할 수 있는 윤곽선 패스입니다. 기존 생성 PNG를 벡터 추적했으므로 윤곽에 미세한 차이는 있을 수 있습니다.

## 개발 및 검증

```sh
npm test
npx tsx --test tests/analysis.test.ts
npm run typecheck
npm run build
npm run start
```

브라우저 테스트는 Chrome과 Python Playwright가 필요합니다.

```sh
uv run --with playwright python tests/browser.py
uv run --with playwright python tests/interaction-details.py
uv run --with playwright python tests/motion-continuity.py
```

AI 테스트는 외부 응답을 모의하며 과금되지 않습니다. 실제 OpenAI 호출은 본인의 키를 설정한 후 확인해야 합니다.

## 구조

- `src/app/api/claims/[id]/analyze/route.ts`: 인증·분석 요청·변경 충돌 검사
- `src/lib/analysis.ts`: 이미지 변환·Responses API·결과 검증
- `src/lib/store.ts`: SQLite 저장
- `src/components/workspace.tsx`: 접수·검토·AI UI
- `src/app/vienna.css`: 공통 디자인과 모션
- `docs/`: 디자인 적용 기록

## 운영 범위

현재 localhost 전용 프로토타입입니다. `.data/claims.sqlite`에 자료를 저장하므로 영구 디스크가 필요합니다. 공개 배포 전 운영용 로그인, 조직 권한, 분산 사용량 제한, 원본 보관·삭제 정책, 개인정보 처리 및 동의 절차를 별도로 구성해야 합니다. 사업 효과·가격은 검증 중인 가정이며 실제 고객 성과로 표시하지 않습니다.

## API 참고

- [OpenAI 이미지 입력](https://developers.openai.com/api/docs/guides/images-vision)
- [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
