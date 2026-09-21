const navigation = document.querySelector('.main-nav');
const menuButton = document.querySelector('.menu-toggle');
const submenuTriggers = document.querySelectorAll('.nav-trigger');

const closeSubmenus = (except = null) => {
  document.querySelectorAll('.nav-item.open').forEach((item) => {
    if (item !== except) {
      item.classList.remove('open');
      item.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
    }
  });
};

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  if (!isOpen) closeSubmenus();
});

submenuTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.stopPropagation();
    const item = trigger.closest('.nav-item');
    const willOpen = !item.classList.contains('open');
    closeSubmenus(item);
    item.classList.toggle('open', willOpen);
    trigger.setAttribute('aria-expanded', String(willOpen));
  });
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    closeSubmenus();
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav-item')) closeSubmenus();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeSubmenus();
    navigation?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }
});

const regionData = {
  '서울특별시': ['강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'],
  '부산광역시': ['강서구','금정구','기장군','남구','동구','동래구','부산진구','북구','사상구','사하구','서구','수영구','연제구','영도구','중구','해운대구'],
  '대구광역시': ['군위군','남구','달서구','달성군','동구','북구','서구','수성구','중구'],
  '인천광역시': ['강화군','계양구','남동구','동구','미추홀구','부평구','서구','연수구','옹진군','중구'],
  '광주광역시': ['광산구','남구','동구','북구','서구'],
  '대전광역시': ['대덕구','동구','서구','유성구','중구'],
  '울산광역시': ['남구','동구','북구','울주군','중구'],
  '세종특별자치시': ['세종특별자치시'],
  '경기도': ['가평군','고양시','과천시','광명시','광주시','구리시','군포시','김포시','남양주시','동두천시','부천시','성남시','수원시','시흥시','안산시','안성시','안양시','양주시','양평군','여주시','연천군','오산시','용인시','의왕시','의정부시','이천시','파주시','평택시','포천시','하남시','화성시'],
  '강원특별자치도': ['강릉시','고성군','동해시','삼척시','속초시','양구군','양양군','영월군','원주시','인제군','정선군','철원군','춘천시','태백시','평창군','홍천군','화천군','횡성군'],
  '충청북도': ['괴산군','단양군','보은군','영동군','옥천군','음성군','제천시','증평군','진천군','청주시','충주시'],
  '충청남도': ['계룡시','공주시','금산군','논산시','당진시','보령시','부여군','서산시','서천군','아산시','예산군','천안시','청양군','태안군','홍성군'],
  '전북특별자치도': ['고창군','군산시','김제시','남원시','무주군','부안군','순창군','완주군','익산시','임실군','장수군','전주시','정읍시','진안군'],
  '전라남도': ['강진군','고흥군','곡성군','광양시','구례군','나주시','담양군','목포시','무안군','보성군','순천시','신안군','여수시','영광군','영암군','완도군','장성군','장흥군','진도군','함평군','해남군','화순군'],
  '경상북도': ['경산시','경주시','고령군','구미시','김천시','문경시','봉화군','상주시','성주군','안동시','영덕군','영양군','영주시','영천시','예천군','울릉군','울진군','의성군','청도군','청송군','칠곡군','포항시'],
  '경상남도': ['거제시','거창군','고성군','김해시','남해군','밀양시','사천시','산청군','양산시','의령군','진주시','창녕군','창원시','통영시','하동군','함안군','함양군','합천군'],
  '제주특별자치도': ['서귀포시','제주시']
};

const consultationUI = document.createElement('div');
consultationUI.innerHTML = `
  <button class="consult-float" type="button" aria-haspopup="dialog" aria-controls="consult-dialog"><span>상담</span><strong>신청</strong></button>
  <dialog class="consult-dialog" id="consult-dialog" aria-labelledby="consult-title">
    <button class="consult-close" type="button" aria-label="상담신청 닫기">×</button>
    <div class="consult-heading"><span>CONTACT</span><h2 id="consult-title">상담신청</h2><p>남겨주신 정보를 확인한 후 담당자가 연락드리겠습니다.</p></div>
    <form id="consult-form">
      <input type="hidden" name="_subject" value="[BizOne] 홈페이지 상담신청" />
      <input type="hidden" name="_template" value="table" />
      <input type="text" name="_honey" tabindex="-1" autocomplete="off" class="consult-honey" aria-hidden="true" />
      <label><span>성명 <b>*</b></span><input type="text" name="성명" autocomplete="name" placeholder="성명을 입력해주세요" required maxlength="30" /></label>
      <label><span>연락처 <b>*</b></span><input type="tel" name="연락처" autocomplete="tel" inputmode="tel" placeholder="010-0000-0000" required maxlength="20" /></label>
      <div class="consult-field"><span>지역 <b>*</b></span><div class="region-selects"><select id="consult-province" name="시도" required><option value="">시·도 선택</option></select><select id="consult-district" name="시군구" required disabled><option value="">시·군·구 선택</option></select></div></div>
      <label><span>상담내용 <b>*</b></span><textarea name="상담내용" placeholder="상담받으실 내용을 입력해주세요" required maxlength="1000"></textarea></label>
      <label class="consult-consent"><input type="checkbox" required /><span>상담을 위한 개인정보 수집 및 이용에 동의합니다.</span></label>
      <button class="consult-submit" type="submit">상담신청 <span>→</span></button>
      <p class="consult-status" role="status" aria-live="polite"></p>
    </form>
  </dialog>`;
document.body.appendChild(consultationUI);

const consultDialog = document.querySelector('#consult-dialog');
const consultOpen = document.querySelector('.consult-float');
const consultClose = document.querySelector('.consult-close');
const consultForm = document.querySelector('#consult-form');
const provinceSelect = document.querySelector('#consult-province');
const districtSelect = document.querySelector('#consult-district');
const consultStatus = document.querySelector('.consult-status');

Object.keys(regionData).forEach((region) => provinceSelect.add(new Option(region, region)));

provinceSelect.addEventListener('change', () => {
  districtSelect.innerHTML = '<option value="">시·군·구 선택</option>';
  (regionData[provinceSelect.value] || []).forEach((district) => districtSelect.add(new Option(district, district)));
  districtSelect.disabled = !provinceSelect.value;
});

const openConsult = () => {
  consultStatus.textContent = '';
  consultDialog.showModal();
  document.body.classList.add('dialog-open');
  consultDialog.querySelector('input[name="성명"]').focus();
};
const closeConsult = () => {
  consultDialog.close();
  document.body.classList.remove('dialog-open');
};

consultOpen.addEventListener('click', openConsult);
document.querySelectorAll('.contact-popup-link').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    navigation?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    closeSubmenus();
    openConsult();
  });
});
consultClose.addEventListener('click', closeConsult);
consultDialog.addEventListener('click', (event) => {
  if (event.target === consultDialog) closeConsult();
});
consultDialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));

consultForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = consultForm.querySelector('.consult-submit');
  button.disabled = true;
  button.firstChild.textContent = '전송 중 ';
  consultStatus.className = 'consult-status';
  consultStatus.textContent = '';
  try {
    const response = await fetch('https://formsubmit.co/ajax/tndusdl0128@korpay.com', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(consultForm)
    });
    if (!response.ok) throw new Error('submit failed');
    consultForm.reset();
    districtSelect.innerHTML = '<option value="">시·군·구 선택</option>';
    districtSelect.disabled = true;
    consultStatus.className = 'consult-status success';
    consultStatus.textContent = '상담신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.';
  } catch (error) {
    consultStatus.className = 'consult-status error';
    consultStatus.textContent = '전송하지 못했습니다. 잠시 후 다시 시도해주세요.';
  } finally {
    button.disabled = false;
    button.firstChild.textContent = '상담신청 ';
  }
});

const localeLabels = { ko: '한국어', en: 'English', ja: '日本語', zh: '简体中文' };
const translations = {
  en: {
    '소개 및 인사말':'Company Introduction','오시는길':'Location','카드단말기':'Card Terminals','바코드스캐너':'Barcode Scanners','라벨프린터':'Label Printers','골프거리측정기':'Golf Rangefinders','공지사항':'Notices','교육일정':'Training Schedule','자료실':'Resources','가맹점 로그인':'Merchant Login',
    '매장의 모든 순간을':'Connect Every Moment','하나로 연결합니다.':'of Your Store.','결제부터 재고·매출 관리, 모바일 운영까지.':'From payments and inventory to sales management and mobile operations.','POS·ERP·APP이 유기적으로 연결되는 비즈원 통합 솔루션입니다.':'BizOne is an integrated solution that seamlessly connects POS, ERP, and mobile applications.','제품 둘러보기':'Explore Products','연동 구조 보기':'View Integration','실시간 데이터 연동':'Real-time Data Sync','매장별 맞춤 구성':'Store-specific Setup','언제 어디서나 확인':'Access Anywhere, Anytime','매장 판매':'Store Sales','통합 경영관리':'Integrated Management','모바일 운영':'Mobile Operations','데이터 연결 상태':'Data Connection Status','판매·재고 반영':'Sales & Inventory Sync',
    '매장 운영에 필요한 핵심 솔루션을':'Essential Solutions for Store Operations','하나의 흐름으로 제공합니다.':'Delivered in One Connected Flow.','판매부터 경영관리, 모바일 확인까지 업무 흐름에 맞춰 연결됩니다.':'Sales, management, and mobile monitoring are connected around the way your business works.','판매의 시작':'Start of Sales','매장 판매·결제·영수증·마감 관리':'Sales, payments, receipts, and daily closing','통합 운영':'Integrated Operations','재고·매입·매출·거래처·경영 현황 관리':'Inventory, purchasing, sales, partners, and business performance','모바일 확장':'Mobile Access','언제 어디서나 주요 현황을 확인하고 업무 처리':'Monitor key business data and work from anywhere',
    '하나의 데이터가':'One Source of Data','매장 전체를 움직입니다.':'Runs Your Entire Store.','판매 데이터는 재고와 매출에 반영되고, 경영 정보는 모바일로 이어집니다.':'Sales data updates inventory and revenue, while management information stays available on mobile.','고객의 업무 방식에 맞춘':'Built Around Your Workflow','운영 시스템을 설계합니다.':'We Design Your Operating System.','매장 규모와 업종, 관리 방식에 맞춰 필요한 기능을 유연하게 연결합니다.':'We flexibly connect the functions you need based on store size, industry, and management style.','통합 솔루션 상담하기':'Request a Solution Consultation',
    '주식회사 코페이':'KORPAY Co., Ltd.','사업자등록번호: 206-81-90716':'Business Registration No.: 206-81-90716','대표: 채수철':'CEO: Soo Cheol Chae','주소: 서울 성동구 성수일로 77 서울숲IT밸리 608-611호':'Address: Seoul Forest IT Valley 608–611, 77 Seongsuil-ro, Seongdong-gu, Seoul','대표번호: 1644-5145':'Main: 1644-5145','개인정보 처리방침':'Privacy Policy',
    '고객의 성공을 향한 기술,':'Technology for Customer Success,','신뢰를 지키는 기업.':'A Company Built on Trust.','비즈원은 결제부터 POS·ERP·APP까지 매장 운영의 모든 흐름을 연결합니다.':'BizOne connects every aspect of store operations, from payments to POS, ERP, and mobile applications.','현장을 이해하는 기술로 더 정확하고 안정적인 비즈니스 환경을 만듭니다.':'Our practical technology creates a more accurate and reliable business environment.','설립':'Established','대표이사':'CEO','사업영역':'Business Areas','핵심가치':'Core Values','고객 성공 · 신뢰 · 혁신':'Customer Success · Trust · Innovation','결제와 경영관리의 경험을':'Payment and Management Expertise','하나의 운영 가치로.':'United into One Operating Value.','고객의 성공':'Customer Success','관계의 신뢰':'Trust in Every Relationship','지속적인 혁신':'Continuous Innovation','변화에 앞서고,':'Leading Change,','신뢰에는':'Unwavering in','한결같겠습니다.':'Our Commitment to Trust.','비즈원 홈페이지를 찾아주신 고객 여러분께 감사드립니다.':'Thank you for visiting the BizOne website.','맞춤형 솔루션':'Tailored Solutions','토탈 결제 서비스':'Total Payment Services','검증된 안정성':'Proven Reliability','직접 개발 역량':'In-house Development','자본금':'Capital','연매출':'Annual Revenue','본사':'Head Office','고객센터':'Customer Center','고객의 비즈니스와 함께한':'Growing Together with Our Customers','도전과 성장의 기록':'A Record of Challenge and Growth',
    '본사 위치와 교통편을 안내드립니다.':'Find our head office and transportation information below.','주소':'Address','대중교통 이용시':'By Public Transportation','차량 이용시 주차안내':'Parking Information','카카오맵에서 보기 ↗':'View on Kakao Map ↗','네이버지도에서 보기 ↗':'View on Naver Map ↗','대표전화':'Main Phone','팩스':'Fax','이메일':'Email',
    '상담':'Contact','신청':'Us','상담신청':'Request a Consultation','남겨주신 정보를 확인한 후 담당자가 연락드리겠습니다.':'A representative will contact you after reviewing your information.','성명':'Name','연락처':'Phone','지역':'Region','상담내용':'Inquiry','성명을 입력해주세요':'Enter your name','상담받으실 내용을 입력해주세요':'Tell us how we can help','시·도 선택':'Select province','시·군·구 선택':'Select city/district','상담을 위한 개인정보 수집 및 이용에 동의합니다.':'I consent to the collection and use of my personal information for this consultation.','상담신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.':'Your request has been received. A representative will contact you shortly.','전송하지 못했습니다. 잠시 후 다시 시도해주세요.':'Unable to submit. Please try again shortly.','검색':'Search','제목':'Title','작성자':'Author','등록일':'Date','조회':'Views','다운로드':'Download','첨부파일':'Attachment','목록':'Back to List','관리자':'Admin','검색어를 입력하세요':'Enter a search term','등록된 자료가 없습니다.':'No resources are available.','등록된 공지사항이 없습니다.':'No notices are available.',
    '세 가지 제품,':'Three Products,','하나의 운영 흐름':'One Connected Workflow','필요한 제품부터 시작하고, 운영 규모에 맞춰 연결할 수 있습니다.':'Start with the products you need and connect more as your business grows.','빠르고 쉬운 매장 판매':'Fast and Simple Store Sales','결제와 주문, 매출 집계를 한 화면에서 처리하는 매장 중심 판매 시스템':'A store-focused sales system for payments, orders, and sales reporting in one place.','간편한 판매·결제':'Simple Sales & Payments','실시간 매출 확인':'Real-time Sales Monitoring','다양한 업종 지원':'Support for Diverse Industries','POS 살펴보기':'Explore POS','정확한 통합 경영관리':'Accurate Integrated Management','매입·재고·매출 데이터를 연결해 운영 현황을 정확하게 관리하는 시스템':'A management system that connects purchasing, inventory, and sales data for accurate operations.','상품·재고 통합관리':'Integrated Product & Inventory Management','매입·매출 분석':'Purchasing & Sales Analysis','다매장 운영관리':'Multi-store Operations','ERP 살펴보기':'Explore ERP','언제 어디서나 모바일 운영':'Mobile Operations Anywhere','매장 밖에서도 핵심 현황을 확인하고 필요한 업무를 이어가는 모바일 앱':'A mobile app that keeps key business information and essential tasks available outside the store.','모바일 현황 조회':'Mobile Performance Monitoring','주요 알림 확인':'Key Notifications','간편한 원격 업무':'Simple Remote Work','APP 살펴보기':'Explore the App','판매가 일어나는 순간,':'The Moment a Sale Happens,','운영 데이터가 움직입니다.':'Your Operations Data Moves.','각 제품이 따로 움직이지 않습니다. POS의 판매 데이터를 ERP가 반영하고, APP에서 핵심 현황을 이어서 확인합니다.':'Every product works together. POS sales data flows into ERP, while the app keeps key information within reach.','판매·결제 발생':'Sale & Payment','재고·매출 자동 반영':'Inventory & Sales Updated Automatically','현황·알림 즉시 확인':'Instant Status & Alerts','연결될수록':'The More You Connect,','운영은 더 단순해집니다.':'The Simpler Operations Become.','중복 입력은 줄이고':'Reduce Duplicate Entry','판매와 재고 데이터를 자동으로 연결해 반복 업무를 줄입니다.':'Automatically connect sales and inventory data to reduce repetitive work.','운영 현황은 정확하게':'Keep Operations Accurate','매장과 본사의 데이터를 한 흐름으로 관리해 판단 기준을 명확하게 만듭니다.':'Manage store and headquarters data in one flow for clearer decisions.','확인은 언제 어디서나':'Stay Informed Anywhere','PC와 모바일을 오가며 필요한 정보를 놓치지 않고 확인합니다.':'Access essential information seamlessly across desktop and mobile.','매장에 필요한 변화,':'The Change Your Store Needs,','비즈원과 함께 시작하세요.':'Starts with BizOne.','솔루션 구성 확인하기':'Explore Solution Options','가맹점 운영에 필요한 기능을':'Everything Your Business Needs,','한 번에 연결합니다.':'Connected in One Place.','결제부터 매장 관리까지, 업종과 운영 환경에 맞는 비즈원 솔루션을 구성해드립니다.':'From payments to store management, we tailor BizOne to your industry and operating environment.','통합 결제':'Integrated Payments','카드·간편결제와 매장 판매 데이터를 안정적으로 연결합니다.':'Reliably connect card and mobile payments with store sales data.','운영 자동화':'Operations Automation','상품·재고·매출을 한 흐름으로 관리해 반복 업무를 줄입니다.':'Manage products, inventory, and sales in one flow to reduce repetitive work.','맞춤 지원':'Tailored Support','매장 규모와 업종에 맞춰 필요한 장비와 시스템을 제안합니다.':'We recommend the right equipment and systems for your store size and industry.','비즈원 도입과 제품 상담이':'Need Help Choosing BizOne','필요하신가요?':'or Discussing a Product?','매장 환경에 맞는 구성부터 설치와 운영 지원까지 상담해드립니다.':'We assist with configuration, installation, and ongoing support tailored to your store.','도입·제품 상담':'Solution & Product Consultation','A/S 문의':'Technical Support','함께 만드는':'Building Together,','비즈니스 네트워크':'A Stronger Business Network','코페이 공식 홈페이지':'Official KORPAY Website','시원아이티 공식 홈페이지':'Official C1 IT Website','실시간':'Real-time','언어 선택':'Select language'
  },
  ja: {
    '소개 및 인사말':'会社紹介・ご挨拶','오시는길':'アクセス','카드단말기':'カード決済端末','바코드스캐너':'バーコードスキャナー','라벨프린터':'ラベルプリンター','골프거리측정기':'ゴルフ距離計','공지사항':'お知らせ','교육일정':'研修日程','자료실':'資料室','가맹점 로그인':'加盟店ログイン',
    '매장의 모든 순간을':'店舗のあらゆる瞬間を','하나로 연결합니다.':'ひとつにつなぎます。','결제부터 재고·매출 관리, 모바일 운영까지.':'決済から在庫・売上管理、モバイル運営まで。','POS·ERP·APP이 유기적으로 연결되는 비즈원 통합 솔루션입니다.':'POS・ERP・アプリがシームレスにつながるBizOne統合ソリューションです。','제품 둘러보기':'製品を見る','연동 구조 보기':'連携構成を見る','실시간 데이터 연동':'リアルタイムデータ連携','매장별 맞춤 구성':'店舗別カスタマイズ','언제 어디서나 확인':'いつでもどこでも確認','매장 판매':'店舗販売','통합 경영관리':'統合経営管理','모바일 운영':'モバイル運営','데이터 연결 상태':'データ接続状況','판매·재고 반영':'販売・在庫反映',
    '매장 운영에 필요한 핵심 솔루션을':'店舗運営に必要な主要ソリューションを','하나의 흐름으로 제공합니다.':'ひとつの流れで提供します。','판매부터 경영관리, 모바일 확인까지 업무 흐름에 맞춰 연결됩니다.':'販売から経営管理、モバイル確認まで、業務フローに合わせて連携します。','판매의 시작':'販売の起点','매장 판매·결제·영수증·마감 관리':'店舗販売・決済・レシート・締め管理','통합 운영':'統合運営','재고·매입·매출·거래처·경영 현황 관리':'在庫・仕入・売上・取引先・経営状況の管理','모바일 확장':'モバイル拡張','언제 어디서나 주요 현황을 확인하고 업무 처리':'いつでもどこでも主要状況を確認し業務を処理',
    '하나의 데이터가':'ひとつのデータが','매장 전체를 움직입니다.':'店舗全体を動かします。','판매 데이터는 재고와 매출에 반영되고, 경영 정보는 모바일로 이어집니다.':'販売データは在庫と売上に反映され、経営情報はモバイルにつながります。','고객의 업무 방식에 맞춘':'お客様の業務方式に合わせた','운영 시스템을 설계합니다.':'運営システムを設計します。','매장 규모와 업종, 관리 방식에 맞춰 필요한 기능을 유연하게 연결합니다.':'店舗規模・業種・管理方式に合わせ、必要な機能を柔軟に連携します。','통합 솔루션 상담하기':'統合ソリューション相談',
    '주식회사 코페이':'株式会社KORPAY','사업자등록번호: 206-81-90716':'事業者登録番号：206-81-90716','대표: 채수철':'代表：チェ・スチョル','주소: 서울 성동구 성수일로 77 서울숲IT밸리 608-611호':'住所：ソウル特別市城東区聖水一路77 ソウルフォレストITバレー608–611号','대표번호: 1644-5145':'代表電話：1644-5145','개인정보 처리방침':'プライバシーポリシー',
    '고객의 성공을 향한 기술,':'お客様の成功を支える技術、','신뢰를 지키는 기업.':'信頼を守る企業。','비즈원은 결제부터 POS·ERP·APP까지 매장 운영의 모든 흐름을 연결합니다.':'BizOneは決済からPOS・ERP・アプリまで、店舗運営のすべての流れをつなぎます。','현장을 이해하는 기술로 더 정확하고 안정적인 비즈니스 환경을 만듭니다.':'現場を理解した技術で、より正確で安定したビジネス環境を実現します。','설립':'設立','대표이사':'代表取締役','사업영역':'事業分野','핵심가치':'中核価値','고객 성공 · 신뢰 · 혁신':'顧客の成功・信頼・革新','결제와 경영관리의 경험을':'決済と経営管理の経験を','하나의 운영 가치로.':'ひとつの運営価値へ。','고객의 성공':'お客様の成功','관계의 신뢰':'信頼ある関係','지속적인 혁신':'継続的な革新','변화에 앞서고,':'変化を先取りし、','신뢰에는':'信頼には','한결같겠습니다.':'常に誠実であり続けます。','비즈원 홈페이지를 찾아주신 고객 여러분께 감사드립니다.':'BizOneのウェブサイトをご覧いただき、誠にありがとうございます。','맞춤형 솔루션':'カスタムソリューション','토탈 결제 서비스':'総合決済サービス','검증된 안정성':'実証された安定性','직접 개발 역량':'自社開発力','자본금':'資本金','연매출':'年間売上高','본사':'本社','고객센터':'カスタマーセンター','고객의 비즈니스와 함께한':'お客様のビジネスと歩んだ','도전과 성장의 기록':'挑戦と成長の軌跡',
    '본사 위치와 교통편을 안내드립니다.':'本社所在地と交通アクセスをご案内します。','주소':'住所','대중교통 이용시':'公共交通機関をご利用の場合','차량 이용시 주차안내':'お車での駐車案内','카카오맵에서 보기 ↗':'Kakaoマップで見る ↗','네이버지도에서 보기 ↗':'NAVERマップで見る ↗','대표전화':'代表電話','팩스':'FAX','이메일':'メール',
    '상담':'相談','신청':'申請','상담신청':'お問い合わせ','남겨주신 정보를 확인한 후 담당자가 연락드리겠습니다.':'ご入力内容を確認後、担当者よりご連絡いたします。','성명':'お名前','연락처':'ご連絡先','지역':'地域','상담내용':'お問い合わせ内容','성명을 입력해주세요':'お名前をご入力ください','상담받으실 내용을 입력해주세요':'お問い合わせ内容をご入力ください','시·도 선택':'都道府県を選択','시·군·구 선택':'市区町村を選択','상담을 위한 개인정보 수집 및 이용에 동의합니다.':'お問い合わせ対応のための個人情報の収集・利用に同意します。','상담신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.':'お問い合わせを受け付けました。確認後、担当者よりご連絡いたします。','전송하지 못했습니다. 잠시 후 다시 시도해주세요.':'送信できませんでした。しばらくしてからもう一度お試しください。','검색':'検索','제목':'タイトル','작성자':'作成者','등록일':'登録日','조회':'閲覧','다운로드':'ダウンロード','첨부파일':'添付ファイル','목록':'一覧','관리자':'管理者','검색어를 입력하세요':'検索語を入力してください','등록된 자료가 없습니다.':'登録された資料はありません。','등록된 공지사항이 없습니다.':'登録されたお知らせはありません。',
    '세 가지 제품,':'3つの製品、','하나의 운영 흐름':'ひとつの運営フロー','필요한 제품부터 시작하고, 운영 규모에 맞춰 연결할 수 있습니다.':'必要な製品から導入し、事業規模に合わせて連携を拡張できます。','빠르고 쉬운 매장 판매':'迅速で使いやすい店舗販売','결제와 주문, 매출 집계를 한 화면에서 처리하는 매장 중심 판매 시스템':'決済・注文・売上集計をひとつの画面で処理できる、店舗中心の販売システムです。','간편한 판매·결제':'かんたん販売・決済','실시간 매출 확인':'売上をリアルタイムで確認','다양한 업종 지원':'多様な業種に対応','POS 살펴보기':'POSを見る','정확한 통합 경영관리':'正確な統合経営管理','매입·재고·매출 데이터를 연결해 운영 현황을 정확하게 관리하는 시스템':'仕入・在庫・売上データを連携し、運営状況を正確に管理するシステムです。','상품·재고 통합관리':'商品・在庫の統合管理','매입·매출 분석':'仕入・売上分析','다매장 운영관리':'複数店舗管理','ERP 살펴보기':'ERPを見る','언제 어디서나 모바일 운영':'いつでもどこでもモバイル運営','매장 밖에서도 핵심 현황을 확인하고 필요한 업무를 이어가는 모바일 앱':'店舗外でも主要状況を確認し、必要な業務を継続できるモバイルアプリです。','모바일 현황 조회':'モバイル状況照会','주요 알림 확인':'重要なお知らせを確認','간편한 원격 업무':'かんたんリモート業務','APP 살펴보기':'アプリを見る','판매가 일어나는 순간,':'販売が発生した瞬間、','운영 데이터가 움직입니다.':'運営データが動きます。','각 제품이 따로 움직이지 않습니다. POS의 판매 데이터를 ERP가 반영하고, APP에서 핵심 현황을 이어서 확인합니다.':'各製品は個別に動くのではなく、POSの販売データをERPへ反映し、アプリで主要状況を継続して確認できます。','판매·결제 발생':'販売・決済','재고·매출 자동 반영':'在庫・売上を自動反映','현황·알림 즉시 확인':'状況・通知を即時確認','연결될수록':'つながるほど、','운영은 더 단순해집니다.':'運営はさらにシンプルに。','중복 입력은 줄이고':'重複入力を削減','판매와 재고 데이터를 자동으로 연결해 반복 업무를 줄입니다.':'販売と在庫データを自動連携し、反復業務を削減します。','운영 현황은 정확하게':'運営状況を正確に','매장과 본사의 데이터를 한 흐름으로 관리해 판단 기준을 명확하게 만듭니다.':'店舗と本社のデータを一元管理し、判断基準を明確にします。','확인은 언제 어디서나':'いつでもどこでも確認','PC와 모바일을 오가며 필요한 정보를 놓치지 않고 확인합니다.':'PCとモバイルを使い分けながら、必要な情報を確実に確認できます。','매장에 필요한 변화,':'店舗に必要な変化を、','비즈원과 함께 시작하세요.':'BizOneとともに始めましょう。','솔루션 구성 확인하기':'ソリューション構成を見る','가맹점 운영에 필요한 기능을':'加盟店運営に必要な機能を','한 번에 연결합니다.':'まとめてつなぎます。','결제부터 매장 관리까지, 업종과 운영 환경에 맞는 비즈원 솔루션을 구성해드립니다.':'決済から店舗管理まで、業種と運営環境に合わせたBizOneをご提案します。','통합 결제':'統合決済','카드·간편결제와 매장 판매 데이터를 안정적으로 연결합니다.':'カード・簡単決済と店舗販売データを安定して連携します。','운영 자동화':'運営の自動化','상품·재고·매출을 한 흐름으로 관리해 반복 업무를 줄입니다.':'商品・在庫・売上を一元管理し、反復業務を削減します。','맞춤 지원':'カスタムサポート','매장 규모와 업종에 맞춰 필요한 장비와 시스템을 제안합니다.':'店舗規模と業種に合わせて、最適な機器とシステムをご提案します。','비즈원 도입과 제품 상담이':'BizOneの導入や製品について','필요하신가요?':'ご相談はございませんか。','매장 환경에 맞는 구성부터 설치와 운영 지원까지 상담해드립니다.':'店舗環境に合わせた構成から設置・運営支援までご相談いただけます。','도입·제품 상담':'導入・製品相談','A/S 문의':'サポート窓口','함께 만드는':'ともにつくる','비즈니스 네트워크':'ビジネスネットワーク','코페이 공식 홈페이지':'KORPAY公式サイト','시원아이티 공식 홈페이지':'C1 IT公式サイト','실시간':'リアルタイム','언어 선택':'言語を選択'
  },
  zh: {
    '소개 및 인사말':'公司介绍与致辞','오시는길':'交通指南','카드단말기':'银行卡终端','바코드스캐너':'条码扫描器','라벨프린터':'标签打印机','골프거리측정기':'高尔夫测距仪','공지사항':'公告','교육일정':'培训日程','자료실':'资料中心','가맹점 로그인':'商户登录',
    '매장의 모든 순간을':'连接门店运营的','하나로 연결합니다.':'每一个环节。','결제부터 재고·매출 관리, 모바일 운영까지.':'从支付、库存和销售管理到移动运营。','POS·ERP·APP이 유기적으로 연결되는 비즈원 통합 솔루션입니다.':'BizOne是一套将POS、ERP和移动应用无缝连接的综合解决方案。','제품 둘러보기':'查看产品','연동 구조 보기':'查看集成架构','실시간 데이터 연동':'实时数据同步','매장별 맞춤 구성':'门店专属配置','언제 어디서나 확인':'随时随地查看','매장 판매':'门店销售','통합 경영관리':'综合经营管理','모바일 운영':'移动运营','데이터 연결 상태':'数据连接状态','판매·재고 반영':'销售与库存同步',
    '매장 운영에 필요한 핵심 솔루션을':'门店运营所需的核心解决方案','하나의 흐름으로 제공합니다.':'通过统一流程提供。','판매부터 경영관리, 모바일 확인까지 업무 흐름에 맞춰 연결됩니다.':'从销售、经营管理到移动查看，均按业务流程顺畅连接。','판매의 시작':'销售起点','매장 판매·결제·영수증·마감 관리':'门店销售、支付、票据及结算管理','통합 운영':'综合运营','재고·매입·매출·거래처·경영 현황 관리':'库存、采购、销售、客户及经营状况管理','모바일 확장':'移动扩展','언제 어디서나 주요 현황을 확인하고 업무 처리':'随时随地查看主要经营数据并处理业务',
    '하나의 데이터가':'统一的数据','매장 전체를 움직입니다.':'驱动整个门店。','판매 데이터는 재고와 매출에 반영되고, 경영 정보는 모바일로 이어집니다.':'销售数据同步至库存与营收，经营信息可通过移动端持续查看。','고객의 업무 방식에 맞춘':'根据客户业务方式','운영 시스템을 설계합니다.':'设计运营系统。','매장 규모와 업종, 관리 방식에 맞춰 필요한 기능을 유연하게 연결합니다.':'根据门店规模、行业和管理方式，灵活连接所需功能。','통합 솔루션 상담하기':'咨询综合解决方案',
    '주식회사 코페이':'KORPAY股份有限公司','사업자등록번호: 206-81-90716':'营业执照号：206-81-90716','대표: 채수철':'代表：蔡洙澈','주소: 서울 성동구 성수일로 77 서울숲IT밸리 608-611호':'地址：韩国首尔市城东区圣水一路77 首尔林IT Valley 608–611室','대표번호: 1644-5145':'总机：1644-5145','개인정보 처리방침':'隐私政策',
    '고객의 성공을 향한 기술,':'以技术助力客户成功，','신뢰를 지키는 기업.':'以行动守护信任。','비즈원은 결제부터 POS·ERP·APP까지 매장 운영의 모든 흐름을 연결합니다.':'BizOne连接从支付到POS、ERP及移动应用的全部门店运营流程。','현장을 이해하는 기술로 더 정확하고 안정적인 비즈니스 환경을 만듭니다.':'以深刻理解现场的技术，打造更精准、更稳定的商业环境。','설립':'成立','대표이사':'代表董事','사업영역':'业务领域','핵심가치':'核心价值','고객 성공 · 신뢰 · 혁신':'客户成功・信任・创新','결제와 경영관리의 경험을':'将支付与经营管理经验','하나의 운영 가치로.':'凝聚为统一运营价值。','고객의 성공':'客户成功','관계의 신뢰':'合作信任','지속적인 혁신':'持续创新','변화에 앞서고,':'引领变化，','신뢰에는':'始终坚守','한결같겠습니다.':'信任与承诺。','비즈원 홈페이지를 찾아주신 고객 여러분께 감사드립니다.':'感谢您访问BizOne官方网站。','맞춤형 솔루션':'定制解决方案','토탈 결제 서비스':'综合支付服务','검증된 안정성':'成熟可靠','직접 개발 역량':'自主研发能力','자본금':'注册资本','연매출':'年销售额','본사':'总部','고객센터':'客户中心','고객의 비즈니스와 함께한':'与客户业务共同走过的','도전과 성장의 기록':'挑战与成长历程',
    '본사 위치와 교통편을 안내드립니다.':'以下为总部位置及交通信息。','주소':'地址','대중교통 이용시':'乘坐公共交通','차량 이용시 주차안내':'驾车及停车指南','카카오맵에서 보기 ↗':'在Kakao地图查看 ↗','네이버지도에서 보기 ↗':'在NAVER地图查看 ↗','대표전화':'总机','팩스':'传真','이메일':'电子邮箱',
    '상담':'咨询','신청':'申请','상담신청':'申请咨询','남겨주신 정보를 확인한 후 담당자가 연락드리겠습니다.':'工作人员将在确认您提交的信息后与您联系。','성명':'姓名','연락처':'联系电话','지역':'地区','상담내용':'咨询内容','성명을 입력해주세요':'请输入姓名','상담받으실 내용을 입력해주세요':'请输入咨询内容','시·도 선택':'请选择省/市','시·군·구 선택':'请选择区/县','상담을 위한 개인정보 수집 및 이용에 동의합니다.':'我同意为处理咨询而收集和使用个人信息。','상담신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.':'咨询申请已受理，工作人员确认后将与您联系。','전송하지 못했습니다. 잠시 후 다시 시도해주세요.':'提交失败，请稍后重试。','검색':'搜索','제목':'标题','작성자':'作者','등록일':'日期','조회':'浏览','다운로드':'下载','첨부파일':'附件','목록':'返回列表','관리자':'管理','검색어를 입력하세요':'请输入搜索词','등록된 자료가 없습니다.':'暂无资料。','등록된 공지사항이 없습니다.':'暂无公告。',
    '세 가지 제품,':'三大产品，','하나의 운영 흐름':'一个运营流程','필요한 제품부터 시작하고, 운영 규모에 맞춰 연결할 수 있습니다.':'从所需产品开始，并可根据经营规模灵活扩展连接。','빠르고 쉬운 매장 판매':'快速便捷的门店销售','결제와 주문, 매출 집계를 한 화면에서 처리하는 매장 중심 판매 시스템':'在一个界面完成支付、订单和销售汇总的门店销售系统。','간편한 판매·결제':'便捷销售与支付','실시간 매출 확인':'实时查看销售额','다양한 업종 지원':'支持多种行业','POS 살펴보기':'了解POS','정확한 통합 경영관리':'精准的综合经营管理','매입·재고·매출 데이터를 연결해 운영 현황을 정확하게 관리하는 시스템':'连接采购、库存和销售数据，精准管理经营状况。','상품·재고 통합관리':'商品与库存综合管理','매입·매출 분석':'采购与销售分析','다매장 운영관리':'多门店运营管理','ERP 살펴보기':'了解ERP','언제 어디서나 모바일 운영':'随时随地移动运营','매장 밖에서도 핵심 현황을 확인하고 필요한 업무를 이어가는 모바일 앱':'在门店外也可查看核心状况并继续处理必要工作的移动应用。','모바일 현황 조회':'移动端状况查询','주요 알림 확인':'查看重要提醒','간편한 원격 업무':'便捷远程办公','APP 살펴보기':'了解应用','판매가 일어나는 순간,':'销售发生的瞬间，','운영 데이터가 움직입니다.':'运营数据同步流动。','각 제품이 따로 움직이지 않습니다. POS의 판매 데이터를 ERP가 반영하고, APP에서 핵심 현황을 이어서 확인합니다.':'各产品协同工作。POS销售数据同步至ERP，并可通过应用持续查看核心状况。','판매·결제 발생':'销售与支付','재고·매출 자동 반영':'自动更新库存与销售额','현황·알림 즉시 확인':'即时查看状况与提醒','연결될수록':'连接越深入，','운영은 더 단순해집니다.':'运营越简单。','중복 입력은 줄이고':'减少重复录入','판매와 재고 데이터를 자동으로 연결해 반복 업무를 줄입니다.':'自动连接销售与库存数据，减少重复工作。','운영 현황은 정확하게':'精准掌握运营状况','매장과 본사의 데이터를 한 흐름으로 관리해 판단 기준을 명확하게 만듭니다.':'统一管理门店与总部数据，让决策依据更加清晰。','확인은 언제 어디서나':'随时随地查看','PC와 모바일을 오가며 필요한 정보를 놓치지 않고 확인합니다.':'在电脑和移动端之间无缝切换，不错过任何重要信息。','매장에 필요한 변화,':'门店所需的改变，','비즈원과 함께 시작하세요.':'从BizOne开始。','솔루션 구성 확인하기':'查看解决方案配置','가맹점 운영에 필요한 기능을':'商户运营所需功能，','한 번에 연결합니다.':'一次全部连接。','결제부터 매장 관리까지, 업종과 운영 환경에 맞는 비즈원 솔루션을 구성해드립니다.':'从支付到门店管理，我们根据行业和运营环境定制BizOne方案。','통합 결제':'综合支付','카드·간편결제와 매장 판매 데이터를 안정적으로 연결합니다.':'稳定连接银行卡、便捷支付与门店销售数据。','운영 자동화':'运营自动化','상품·재고·매출을 한 흐름으로 관리해 반복 업무를 줄입니다.':'统一管理商品、库存与销售，减少重复工作。','맞춤 지원':'定制支持','매장 규모와 업종에 맞춰 필요한 장비와 시스템을 제안합니다.':'根据门店规模和行业，推荐合适的设备与系统。','비즈원 도입과 제품 상담이':'需要咨询BizOne导入','필요하신가요?':'或产品吗？','매장 환경에 맞는 구성부터 설치와 운영 지원까지 상담해드립니다.':'我们提供适合门店环境的配置、安装及运营支持咨询。','도입·제품 상담':'导入与产品咨询','A/S 문의':'售后服务','함께 만드는':'携手共建','비즈니스 네트워크':'商业网络','코페이 공식 홈페이지':'KORPAY官方网站','시원아이티 공식 홈페이지':'C1 IT官方网站','실시간':'实时','언어 선택':'选择语言'
  }
};

const textSources = new WeakMap();
const attributeSources = new WeakMap();
const translatableAttributes = ['placeholder','aria-label','title'];
const preserveSpacing = (value, replacement) => value.replace(value.trim(), replacement);

function dynamicTranslation(source, locale) {
  if (locale === 'ko') return source;
  let match = source.match(/^총\s*(\d+)개의 자료$/);
  if (match) return locale === 'en' ? `${match[1]} resources` : locale === 'ja' ? `資料 ${match[1]}件` : `共 ${match[1]} 份资料`;
  match = source.match(/^총\s*(\d+)개의 공지$/);
  if (match) return locale === 'en' ? `${match[1]} notices` : locale === 'ja' ? `お知らせ ${match[1]}件` : `共 ${match[1]} 条公告`;
  return translations[locale]?.[source] || source;
}

function applyLocale(locale) {
  const dictionary = translations[locale] || {};
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    if (node.parentElement?.closest('script,style,noscript,.language-selector')) return;
    if (!textSources.has(node)) textSources.set(node, node.nodeValue);
    const original = textSources.get(node);
    const source = original.trim();
    if (!source) return;
    node.nodeValue = preserveSpacing(original, dynamicTranslation(source, locale));
  });
  document.querySelectorAll('*').forEach((element) => {
    if (element.closest('.language-selector')) return;
    if (!attributeSources.has(element)) attributeSources.set(element, {});
    const stored = attributeSources.get(element);
    translatableAttributes.forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      if (!(attribute in stored)) stored[attribute] = element.getAttribute(attribute);
      const source = stored[attribute];
      element.setAttribute(attribute, dictionary[source] || source);
    });
  });
  document.querySelectorAll('.language-option').forEach((button) => button.classList.toggle('active', button.dataset.locale === locale));
  const current = document.querySelector('.language-current');
  if (current) current.textContent = localeLabels[locale];
  try { localStorage.setItem('bizone-locale', locale); } catch (_) {}
}

function initLanguageSelector() {
  if (!navigation || navigation.querySelector('.language-selector')) return;
  const selector = document.createElement('div');
  selector.className = 'language-selector';
  selector.innerHTML = `<button class="language-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-label="언어 선택"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"></path></svg><span class="language-current">한국어</span><span class="language-chevron" aria-hidden="true"></span></button><div class="language-menu" role="menu">${Object.entries(localeLabels).map(([code,label]) => `<button class="language-option" type="button" data-locale="${code}" role="menuitem">${label}</button>`).join('')}</div>`;
  navigation.appendChild(selector);
  const toggle = selector.querySelector('.language-toggle');
  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const open = selector.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  selector.querySelectorAll('.language-option').forEach((button) => button.addEventListener('click', () => {
    applyLocale(button.dataset.locale);
    selector.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
  }));
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.language-selector')) {
      selector.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
    }
  });
  let saved = 'ko';
  try { saved = localStorage.getItem('bizone-locale') || 'ko'; } catch (_) {}
  applyLocale(localeLabels[saved] ? saved : 'ko');
}

initLanguageSelector();
