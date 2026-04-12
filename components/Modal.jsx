import React, { useState, useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose }) => {
    const [inputData, setInputData] = useState('');
    const modalRef = useRef(null); 

    const handleInputChange = (e) => {
        setInputData(e.target.value);
    };

    const handleConfirm = () => {
        // onAction(inputData);
        setInputData('');
        onClose();
    };

    const onEnterPress = (e) => {
        if (e.keyCode == 13 && e.shiftKey == false) {
          e.preventDefault();
          handleConfirm();
        }
      }

    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.body.classList.add('overflow-hidden'); 
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.body.style.paddingRight = ''; 
            document.body.classList.remove('overflow-hidden');
        }

        return () => {
            document.body.style.paddingRight = ''; 
            document.body.classList.remove('overflow-hidden');
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen]);

    return (
        <div className={`fixed smooth-entry inset-0 flex items-center justify-center ${isOpen ? 'z-50' : 'hidden'}`}>
            {/* Background blur */}
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

            {/* Modal content */}
            <div ref={modalRef} className="relative bg-white rounded-lg shadow-lg p-6 z-10">
                <button className="absolute top-0 right-0 p-2" onClick={onClose}>
                    X
                </button>
                <h1 className='text-2xl text-center font-semibold p-5'>add task</h1>
                <input
                    type="text"
                    value={inputData}
                    onKeyDown={onEnterPress}
                    onChange={handleInputChange}
                    placeholder="Write amount..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                    className="mt-4 bg-blue-500 w-full text-white px-4 py-2 rounded"
                    onClick={handleConfirm}
                >
                    add 
                    {/* {actionName} */}
                </button>
            </div>
        </div>
    );
};

export default Modal;


