import { useEffect } from 'react';

const ViewPagamento = ({ dados, onClose }) => {

  useEffect(() => {
    const init = async () => {
      const { Modal, Ripple, Datepicker, Input, Datetimepicker, initTE } =
      await import("tw-elements");
      initTE({
        Modal, 
        Ripple,
        Datepicker,
        Input,
        Datetimepicker,
      });
    };
    init();
  }, [])


  return (
    <div
      className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
      id="paymentInfoModal"
      tabIndex="-1"
      aria-labelledby="exampleModalCenterTitle"
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered relative w-auto pointer-events-none">
        <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
          <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
            <h5 className="text-xl font-medium leading-normal text-gray-800" id="exampleModalCenterTitle">
              Informações do Pagamento
            </h5>
            <button
              type="button"
              className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body relative p-4">
            {/* <p><strong>ID Pagamento:</strong> {dados?.id_pagamento}</p>
            <p><strong>Número da Parcela:</strong> {dados?.nr_parcela}</p>
            <p><strong>Valor:</strong> {dados?.valor}</p>
            <p><strong>Data de Vencimento:</strong> {dados?.dt_vencimento}</p>
            <p><strong>Status:</strong> {dados?.status}</p>
            <p><strong>Nome do Paciente:</strong> {dados?.id_paciente}</p>
            <p><strong>Data do Recebimento:</strong> {dados?.dt_recebimento}</p> */}
          </div>
          <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
            <button
              type="button"
              className="px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
              data-bs-dismiss="modal"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPagamento;
