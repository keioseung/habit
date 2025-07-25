# 습관 형성 앱 (Habit Formation App)

습관을 만들고 캐릭터를 성장시키는 Progressive Web App입니다.

## 🚀 주요 기능

- ✅ **사용자 인증** - Supabase 기반 로그인/회원가입
- ✅ **습관 관리** - 추가, 수정, 삭제, 요일별 반복 설정
- ✅ **오늘의 습관 체크** - 체크박스로 습관 완료 체크
- ✅ **캐릭터 성장** - 경험치 획득 및 레벨업 시스템
- ✅ **PWA 지원** - 모바일 앱처럼 설치 가능
- ✅ **반응형 디자인** - 모바일/데스크톱 대응

## 📱 PWA 기능

### 설치 방법
1. **Chrome/Edge**: 주소창 옆 설치 버튼 클릭
2. **Safari**: 공유 버튼 → "홈 화면에 추가"
3. **Android**: 브라우저 메뉴 → "홈 화면에 추가"

### PWA 특징
- 📱 **앱처럼 동작** - 브라우저 UI 숨김
- 🏠 **홈 화면 아이콘** - 커스텀 아이콘
- ⚡ **빠른 로딩** - 캐싱 및 최적화
- 🔄 **오프라인 지원** - 기본 기능 동작
- 📱 **푸시 알림** - 습관 리마인더 (추후 구현)

## 🛠️ 기술 스택

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database)
- **PWA**: Web App Manifest, Service Worker
- **Deployment**: Vercel, Netlify 등

## 📦 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env.local` 파일 생성:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 프로덕션 빌드
```bash
npm run build
npm start
```

## 🗄️ 데이터베이스 설정

### Supabase SQL 실행
```sql
-- users 테이블
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  level int default 1,
  exp int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- habits 테이블
create table habits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  repeat_days text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- habit_logs 테이블
create table habit_logs (
  id uuid primary key default uuid_generate_v4(),
  habit_id uuid references habits(id) on delete cascade,
  date date not null,
  checked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS 정책 설정
alter table users enable row level security;
alter table habits enable row level security;
alter table habit_logs enable row level security;

-- habits 정책
create policy "Users can access their own habits"
on habits for all
using (user_id = auth.uid());

-- habit_logs 정책
create policy "Users can access their own habit logs"
on habit_logs for all
using (habit_id in (select id from habits where user_id = auth.uid()));

-- users 정책
create policy "Users can update their own profile"
on users for update
using (id = auth.uid());
```

## 🚀 배포

### Vercel 배포 (권장)
1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 연결
3. 환경변수 설정
4. 자동 배포 완료

### 수동 배포
```bash
npm run build
npm run export  # 정적 파일 생성
```

## 📱 PWA 아이콘 생성

### 필요한 아이콘 크기
- 16x16, 32x32 (favicon)
- 72x72, 96x96, 128x128, 144x144
- 152x152, 192x192, 384x384, 512x512

### 아이콘 생성 도구
- [PWA Builder](https://www.pwabuilder.com/imageGenerator)
- [Favicon Generator](https://realfavicongenerator.net/)

## 🔧 커스터마이징

### 테마 색상 변경
`tailwind.config.js`에서 색상 설정:
```js
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#4f46e5',
        600: '#4338ca',
      }
    }
  }
}
```

### PWA 설정 변경
`public/manifest.json`에서 앱 정보 수정:
```json
{
  "name": "앱 이름",
  "short_name": "짧은 이름",
  "theme_color": "#4f46e5",
  "background_color": "#f9fafb"
}
```

## 📈 성장 로직

### 경험치 시스템
- 습관 체크 1회 = +10 경험치
- 경험치 100 = 레벨업
- 레벨업 시 경험치 초기화 (100 빼기)

### 확장 가능한 기능
- 캐릭터 스킨/테마
- 습관 통계 및 분석
- 푸시 알림
- 소셜 기능 (친구, 랭킹)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요. 