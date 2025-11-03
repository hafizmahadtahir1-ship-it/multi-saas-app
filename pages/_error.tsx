// pages/_error.tsx
import { NextPageContext } from "next";
import Error from "next/error";

type ErrorProps = {
  statusCode?: number;
};

const CustomErrorComponent = ({ statusCode }: ErrorProps) => {
  return <Error statusCode={statusCode || 500} />;
};

CustomErrorComponent.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default CustomErrorComponent;