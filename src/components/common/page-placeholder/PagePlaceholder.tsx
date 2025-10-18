import React from 'react';

type Props = { title: string; note?: string };

const PagePlaceholder: React.FC<Props> = ({ title, note }) => {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>{title}</h1>
      <p>👷‍♂️ המסך הזה בדרך. בינתיים זהו דף זמני.</p>
      {note && <p style={{ opacity: 0.7 }}>{note}</p>}
    </div>
  );
};

export default PagePlaceholder;
