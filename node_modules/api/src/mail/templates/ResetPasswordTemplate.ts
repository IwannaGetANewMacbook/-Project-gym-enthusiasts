export const generateResetPasswordEmailHtml = (
  userName: string,
  resetLink: string,
  brandName: string,
) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <h2 style="color: #333;">안녕하세요${userName ? `, ${userName}` : ''}!</h2>
    <p style="font-size: 16px; color: #555;">비밀번호 재설정을 요청하셨습니다.</p>
    <p style="font-size: 16px; color: #555;">아래 버튼을 클릭하셔서 새 비밀번호를 설정해 주세요:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" 
         style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
         🔑 비밀번호 재설정
      </a>
    </div>
    <p style="font-size: 14px; color: #999;">버튼이 작동하지 않는 경우, 아래 링크를 복사하여 브라우저에 붙여넣기 해주세요:</p>
    <p style="font-size: 14px; color: #999;"><a href="${resetLink}">${resetLink}</a></p>
    <hr style="margin: 40px 0;" />
    <p style="font-size: 12px; color: #aaa;">이 링크는 10분 후 만료되며, 다시 요청하셔야 합니다.</p>
    <p style="font-size: 12px; color: #aaa;">감사합니다!<br/>${brandName} 팀</p>
  </div>
`;
