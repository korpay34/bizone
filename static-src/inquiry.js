(() => {
  document.body.insertAdjacentHTML("beforeend", "<button class=\"inquiry-float\" type=\"button\" aria-label=\"문의하기 창 열기\" aria-haspopup=\"dialog\" aria-controls=\"inquiry-dialog\">문의<br>하기</button>\n<dialog class=\"inquiry-dialog\" id=\"inquiry-dialog\" aria-labelledby=\"inquiry-title\">\n  <div class=\"inquiry-head\"><small>CONTACT BIZONE</small><h2 id=\"inquiry-title\">상담신청</h2><p>내용을 남겨주시면 담당자가 연락드리겠습니다.</p><button class=\"inquiry-close\" type=\"button\" aria-label=\"닫기\">×</button></div>\n  <form class=\"inquiry-form\" id=\"inquiry-form\">\n    <input type=\"hidden\" name=\"_subject\" value=\"[BIZONE] 홈페이지 상담신청\">\n    <input type=\"hidden\" name=\"_template\" value=\"table\">\n    <input class=\"inquiry-honey\" type=\"text\" name=\"_honey\" tabindex=\"-1\" autocomplete=\"off\" aria-hidden=\"true\">\n    <label class=\"inquiry-field\">문의유형 <span class=\"required\" aria-hidden=\"true\">*</span><select name=\"문의유형\" required><option value=\"\">문의유형 선택</option><option value=\"ERP\">ERP</option><option value=\"POS\">POS</option><option value=\"스캐너\">스캐너</option></select></label>\n    <label class=\"inquiry-field\">상호<input name=\"상호\" type=\"text\" autocomplete=\"organization\" placeholder=\"상호를 입력해주세요\" maxlength=\"100\"></label>\n    <label class=\"inquiry-field\">성명 <span class=\"required\" aria-hidden=\"true\">*</span><input name=\"성명\" type=\"text\" autocomplete=\"name\" placeholder=\"성명을 입력해주세요\" maxlength=\"30\" required></label>\n    <label class=\"inquiry-field\">연락처 <span class=\"required\" aria-hidden=\"true\">*</span><input name=\"연락처\" type=\"tel\" autocomplete=\"tel\" inputmode=\"tel\" placeholder=\"010-0000-0000\" maxlength=\"20\" pattern=\"[0-9+() -]{8,20}\" title=\"숫자와 하이픈(-)으로 연락처를 입력해 주세요\" required></label>\n    <label class=\"inquiry-field\">업종 <span class=\"required\" aria-hidden=\"true\">*</span><input name=\"업종\" type=\"text\" placeholder=\"업종을 입력해주세요 (예: 약국, 마트, 음식점)\" maxlength=\"100\" required></label>\n    <div class=\"inquiry-field\"><span>지역 <span class=\"required\" aria-hidden=\"true\">*</span></span><div class=\"inquiry-region\"><select name=\"시도\" id=\"inquiry-province\" aria-label=\"시도\" required><option value=\"\">시·도 선택</option></select><select name=\"시군구\" id=\"inquiry-district\" aria-label=\"시군구\" required disabled><option value=\"\">시·군·구 선택</option></select></div></div>\n    <label class=\"inquiry-field\">상담내용 <span class=\"required\" aria-hidden=\"true\">*</span><textarea name=\"상담내용\" placeholder=\"문의하실 내용을 입력해주세요\" maxlength=\"1000\" required></textarea></label>\n    <label class=\"inquiry-consent\"><input type=\"checkbox\" required><span>상담을 위한 개인정보 수집 및 이용에 동의합니다. <a href=\"/a-privacy-20260928.html\" target=\"_blank\" rel=\"noopener noreferrer\">개인정보 처리방침</a></span></label>\n    <button class=\"inquiry-submit\" type=\"submit\">상담신청 →</button>\n    <p class=\"inquiry-status\" role=\"status\" aria-live=\"polite\"></p>\n  </form>\n</dialog>");
  const floatingActions = document.querySelector(".floating-actions");
  if (floatingActions) {
    const inquiryButton = document.querySelector(".inquiry-float");
    inquiryButton.innerHTML = "<span>문의<br>하기</span>";
    floatingActions.prepend(inquiryButton);
  }
  const regions = {
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
  const dialog = document.getElementById('inquiry-dialog');
  const form = document.getElementById('inquiry-form');
  const province = document.getElementById('inquiry-province');
  const district = document.getElementById('inquiry-district');
  const status = form.querySelector('.inquiry-status');
  const submit = form.querySelector('.inquiry-submit');
  for (const name of Object.keys(regions)) province.add(new Option(name,name));
  province.addEventListener('change', () => {
    district.replaceChildren(new Option('시·군·구 선택',''));
    for (const name of regions[province.value] || []) district.add(new Option(name,name));
    district.disabled = !province.value;
  });
  function open(){if(!dialog.open){dialog.showModal();document.body.style.overflow='hidden';status.textContent='';status.className='inquiry-status';form.querySelector('[name="문의유형"]').focus()}}
  function close(){dialog.close()}
  document.querySelector('.inquiry-float').addEventListener('click',open);
  document.querySelector('.inquiry-close').addEventListener('click',close);
  document.querySelectorAll('[data-open-inquiry]').forEach(link => link.addEventListener('click',event => {event.preventDefault();open()}));
  dialog.addEventListener('click',event => {if(event.target===dialog)close()});
  dialog.addEventListener('close',()=>{document.body.style.overflow=''});
  form.addEventListener('submit',async event => {
    event.preventDefault();
    if(!form.reportValidity())return;
    submit.disabled=true;submit.textContent='전송 중…';status.textContent='';status.className='inquiry-status';
    try{
      const response=await fetch('https://formsubmit.co/ajax/tndusdl0128@korpay.com',{method:'POST',headers:{Accept:'application/json'},body:new FormData(form)});
      if(!response.ok)throw new Error('Request failed');
      const result=await response.json();
      if(result.success!==true && result.success!=='true')throw new Error('Submission not accepted');
      form.reset();district.replaceChildren(new Option('시·군·구 선택',''));district.disabled=true;
      status.className='inquiry-status success';status.textContent='상담신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.';
    }catch(error){status.className='inquiry-status error';status.textContent='전송하지 못했습니다. 잠시 후 다시 시도해주세요.'}
    finally{submit.disabled=false;submit.textContent='상담신청 →'}
  });
})();
