import Skeleton from "@mui/material/Skeleton";

const SkeletonCard = () => {
  return (
    <div className="col-md-4 my-3" aria-hidden="true">
      <div className="card">
        <Skeleton variant="rectangular" height={220} />
        <div className="card-body">
          <Skeleton variant="text" height={40} />
          <Skeleton variant="text" height={25} />
          <Skeleton variant="text" height={25} width="80%" />
          <Skeleton variant="rounded" width={100} height={35} />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
