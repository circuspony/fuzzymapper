import { MutableRefObject, useEffect, useRef } from "react";

const ModalOverlay = ({ children, modalOpen, setModalOpen, classes = '', canClose = true }) => {
    const modalOverlayRef = useRef() as MutableRefObject<HTMLDivElement>;
    const modalWrap = useRef();
    useEffect(() => {
        const body = document.getElementById("__next")
        if (modalOpen) {
            body.style.overflow = "hidden"
        } else {
            body.style.overflow = ""
        }
    }, [modalOpen]);
    return (
        <div
            onMouseDown={(e: any) => {
                if (e.clientX < e.target.clientWidth) {
                    if (
                        e.target === modalOverlayRef.current || e.target === modalWrap.current
                    ) {
                        if (canClose) setModalOpen()
                    }
                }
            }}
            ref={modalOverlayRef}
            style={{ opacity: modalOpen ? 1 : 0 }}
            className={`opacity-0 ${modalOpen ? "pointer-events-auto" : "pointer-events-none"
                } h-full fixed top-0 left-0 z-50 bg-black bg-opacity-50 w-full overflow-y-auto flex justify-center transition-opacity duration-500`}
        >
            <div

                className={`w-full flex gap justify-center `}
            >
                <div
                    ref={modalWrap}
                    className={`h-full w-full ${classes}`}>
                    {children}
                </div>

            </div>
        </div>
    );
};

export default ModalOverlay;
