# K-Buddy
## 📱 프로젝트 소개
K-Buddy는 한국을 방문하는 외국인들의 경험을 향상시키기 위해 설계된 React Native 기반 모바일 애플리케이션입니다.<br/>
이 플랫폼은 문화적 인사이트와 여행 가이드를 제공하고, 현지 관광 가이드와의 연결을 촉진하여 진정성 있고 원활한 한국 경험을 보장합니다.

## 📁 프로젝트 구조
```
KBuddy-App/
├── src/
│   ├── components/      # 재사용 가능한 UI 컴포넌트
│   ├── screens/         # 애플리케이션 화면
│   ├── navigation/      # 네비게이션 구성
│   ├── services/        # API 및 외부 서비스
│   ├── utils/           # 유틸리티 함수
│   ├── hooks/           # 커스텀 React 훅
│   ├── types/           # TypeScript 타입 정의
│   └── assets/          # 이미지, 폰트 및 기타 에셋
├── app.json             # Expo 설정
├── package.json         # 의존성 및 스크립트
└── tsconfig.json        # TypeScript 설정
```

## ✨ 주요 기능
- **OAuth 로그인**: 카카오, 구글, 애플 소셜로그인으로 간편한 로그인
- **네이티브 카메라/갤러리**: 블로그 및 QnA 게시글을 작성할때나 프로필 이미지 변경할 때, 앱에서 직접 사진 촬영하거나 기기에서 사진 업로드
- **FCM + Push Notifiation**: 푸시 알림으로 다른 사용자가 게시글에 좋아요나 댓글을 달면 알림 수신
- **콘텐츠 공유**: 블로그 및 Q&A 게시글을 다른 사용자와 공유
- **Permission(권한)**: 네이티브 기능 접근에 대한 권한 요청

## 🛠 기술 스택
### 핵심 기술
- React Native (0.76.7) 
- Expo (~52.0.31) 
- TypeScript (5.3.3)
- React Native WebView

### 네비게이션
- React Navigation

### OAuth
- @react-native-kakao 
- @react-native-google-signin
- Expo Apple Authentication

### Firebase
- @react-native-firebase/app
- @react-native-firebase/analytics
- @react-native-firebase/crashlytics
- @react-native-firebase/messaging

### Expo-Module
- Expo Camera
- Expo Image Picker
- Expo Image Manipulator
- Expo Media Library
- Expo Notifications
- Expo Linking
- Async Storage

### OTA(Code Push)
- Hot Updater

## 🔍 개발 이슈와 해결 과정
### WebView 고해상도 이미지 전송 최적화

#### 문제점
게시물 포스트 및 프로필 이미지를 업로드할 때, 고해상도 이미지의 Base64 인코딩으로 인한 데이터 증가가 WebView 메모리 전달 과정에서 문제를 발생했습니다.
원본 이미지를 Base64로 인코딩하는 과정에서 데이터가 약 30% 증가하여 WebView 브리지 전송 한계를 초과했고, 이로 인해 메모리 부족 현상이 발생하며 앱이 비정상 종료되는 OOM(Out of Memory) 문제가 발생했습니다.

#### 해결 방법
[expo-image-manipulator](https://docs.expo.dev/versions/latest/sdk/imagemanipulator/) 모듈을 활용하여 이미지를 업로드하기 전 적절한 크기인 1~2MB 수준으로 압축하도록 구현했습니다. 
이를 통해 이미지 업로드 성공률을 100%로 향상시켰으며, WebView와 App 간의 데이터 전송 안정성을 확보하여 OOM 이슈를 완전히 해결했습니다.

## 👥 팀 소개

### 개발팀

| 프로필 | 파트 | 이름 | GitHub |
|--------|------|------|--------|
| <img src="https://github.com/dpfprtus.png" width="60"> | **Backend** | 최수용 | [@dpfprtus](https://github.com/dpfprtus) |
| <img src="https://github.com/dlchdaud123.png" width="60"> | **Backend** | 이총명 | [@dlchdaud123](https://github.com/dlchdaud123) |
| <img src="https://github.com/wonjung-jang.png" width="60"> | **Frontend** | 장원정 | [@wonjung-jang](https://github.com/wonjung-jang) |
| <img src="https://github.com/Dragonite-Lee.png" width="60"> | **Frontend** | 이준영 | [@Dragonite-Lee](https://github.com/Dragonite-Lee) |
| <img src="https://github.com/ParkJongJoon7128.png" width="60"> | **App** | 박종준 | [@ParkJongJoon7128](https://github.com/ParkJongJoon7128) |
