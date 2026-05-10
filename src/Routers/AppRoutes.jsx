import { Routes, Route } from "react-router-dom";
import NewsInfinite from "../Components/NewsInfinite";
import { NEWS_CATEGORIES } from "../constants/categories";

const AppRoutes = ({ pageSize, country, setProgress }) => {
  return (
    <Routes>
      {NEWS_CATEGORIES.map(({ path, category }) => (
        <Route
          key={category}
          path={path}
          element={
            <NewsInfinite
              pageSize={pageSize}
              country={country}
              category={category}
              setProgress={setProgress}
            />
          }
        />
      ))}
    </Routes>
  );
};

export default AppRoutes;
