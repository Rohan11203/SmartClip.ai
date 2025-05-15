import Image from "@/assets/smartClipImage2.jpg";

const StepCard = ({title,description,step}:any) => {
  return (
      <div className="border border-slate-100 shadow-sm rounded-2xl h-full w-[350px] ">
        <div className=" rounded-2xl m-4">
          <div className="bg-blue-50 p-4 rounded-2xl">
            <img src={Image} className="" />
          </div>
        </div>
        <div className="m-6 ">
          <h4 className="spectral-regular border border-slate-200 w-20 px-3 py-1 rounded-lg shadow-md">
            {step}
          </h4>
          <h2 className="spectral-medium text-xl pt-2">{title}</h2>
          <p className="spectral-light">
            {description}&nbsp; &nbsp;
          </p>
        </div>
      </div>
  );
};

export default StepCard;
