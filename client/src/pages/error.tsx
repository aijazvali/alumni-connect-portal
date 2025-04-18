// This is the default Next.js error fallback
function Error({ statusCode }: { statusCode: number }) {
    return (
      <p className="text-center p-4 text-red-600">
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : "An error occurred on client"}
      </p>
    );
  }
  
  Error.getInitialProps = ({ res, err }: any) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
  };
  
  export default Error;
  