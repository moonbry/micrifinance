import type { FC } from "react";

const Footer: FC = () => {
  return (
    <div className="footer">
      <p>© 2026 Microfinance System. All rights reserved.</p>

      <style>{`
        .footer {
          height: 45px;
          background: #1e293b;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top: 1px solid #334155;
          width: 100%;
          font-size: 13px;
        }

        .footer p {
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default Footer;