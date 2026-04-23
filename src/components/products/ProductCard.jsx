import { useTheme } from "../ThemeContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { isDark } = useTheme();
  const theme = isDark ? "dark" : "light";

  return (
    <div className={`product-card ${theme}`}>
      <img src={product.image} alt={product.name} />

      <div className="product-body">
        <span className={`product-category ${theme}`}>
          {product.category}
        </span>

        <h3 className={`product-name ${theme}`}>
          {product.name}
        </h3>

        <p className={`product-price ${theme}`}>
          ${product.price.toFixed(2)}
        </p>

        <p className={`product-description ${theme}`}>
        {product.description}
       </p>
      </div>
    </div>
  );
}

export default ProductCard;