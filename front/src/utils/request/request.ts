import axios from "axios";
import { Request, SendResponse } from "./types";

const BASE_URL = "https://api-dte.sme-mogidascruzes.sp.gov.br/"; 

export const request = async ({
  method,
  path,
  body,
  headers,
  params,
  baseURL
}: Request) => {
  try {
    const { status, statusText, data } = await axios.request({
      baseURL: baseURL || BASE_URL,
      headers,
      method,
      url: path,
      data: body,
      params,
    });

    return sendResponse({
      status,
      message: data?.message || statusText,
      data: data.data ? data.data : data,
    });
  } catch (error: any) {
    return sendResponse({
      status: error?.response?.status,
      message:
        error.error ||
        error.response?.data?.error ||
        error.message ||
        defaultMessage,
    });
  }
};

const defaultMessage =
  "Serviço indisponível, verifique sua conexão com a internet, ou tente novamente mais tarde!";

const sendResponse = ({ status, message, data }: SendResponse) => {
  if (status === 401) {
    sessionStorage.clear();
    return { error: "expired" };
  }

  if (status !== 200 || !status) {
    return { error: !message ? defaultMessage : message, status };
  }

  return { error: null, data };
};

export default request;