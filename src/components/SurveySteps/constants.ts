export const BASESTEPS = [
  {
    id: 'name',
    lead: '🎫 Trước khi lên tàu, vui lòng cho chúng tôi biết tên bạn',
    placeholder: 'Tên hành khách',
    type: 'text',
  },
  {
    id: 'nickname',
    lead: '🕰️ Nếu đăng nhập lại Yahoo Messenger, bạn sẽ gõ gì vào ô “ID”?',
    placeholder: 'Nickname',
    type: 'text',
  },
  {
    id: 'join',
    lead: '🥳 Bạn đã sẵn sàng tua lại thanh xuân chưa ?',
    type: 'radio',
  },
];

export const JOINSTEPS = {
  true: {
    id: 'count',
    lead: '🚆 Bạn muốn lên tàu cùng bao nhiêu người?',
    placeholder: 'Số người',
    type: 'number',
  },
  false: {
    id: 'reason',
    lead: '💭 Điều gì khiến bạn muốn ở lại hiện tại?',
    placeholder: 'Lý do…',
    type: 'textarea',
  },
};
