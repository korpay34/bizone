// '이 모델 문제 해결하기' links: open the chatbot widget in place once it has loaded.
// Without the widget (still loading, or CHATBOT_URL not set) the link's href goes to 고객센터 > 장비 셀프해결.
document.addEventListener('click', (event) => {
  const link = event.target.closest('[data-chatbot-model]');
  if (!link || !window.BizoneChat) return;
  event.preventDefault();
  window.BizoneChat.open({ model: link.dataset.chatbotModel });
});
