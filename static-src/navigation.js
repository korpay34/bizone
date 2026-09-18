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
