import React from "react";

interface ModalWithFormProps {
  title: string;
  // isOpen: (value: boolean) => void; // currently returns nothing...
  // TO-DO: Define other functions and write logic in `app.tsx`
}

const ModalWithForm: React.FC<React.PropsWithChildren<ModalWithFormProps>> = ({
  children,
  title,
}) => {
  return (
    <div className="modal">
      <h2 className="modal__header">{title}</h2>
      {children}
    </div>
  );
};

export default ModalWithForm;
