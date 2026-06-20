// src/data/products.js

// 1. Import tất cả ảnh từ thư mục assets/images
import aoThunTrang from '../assets/images/Áo Thun Basic Trắng.png';
import soMiCongSo from '../assets/images/Áo Sơ Mi Công Sở.png';
import hoodieStreetwear from '../assets/images/Hoodie Streetwear.png';
import aoKhoacBomber from '../assets/images/Áo Khoác Bomber.png';
import aoThunPolo from '../assets/images/Áo Thun Polo.png';
import soMiKeSoc from '../assets/images/Áo Sơ Mi Kẻ Sọc.png';
import hoodieZipUp from '../assets/images/Hoodie Zip-Up.png';
import aoKhoacDenim from '../assets/images/Áo Khoác Denim.png';

export default [
    {
        id: 1,
        name: "Áo Thun Basic Trắng",
        price: 299000,
        image: aoThunTrang, // 2. Sử dụng biến đã import
        category: "ao-thun",
        description: "Áo thun basic chất liệu cotton 100%, form dáng regular fit, phù hợp cho mọi hoạt động hằng ngày."
    },
    {
        id: 2,
        name: "Áo Sơ Mi Công Sở",
        price: 599000,
        image: soMiCongSo, // 2. Sử dụng biến đã import
        category: "ao-so-mi",
        description: "Áo sơ mi cao cấp dành cho công sở, chất liệu vải mềm mại, không nhăn, dễ dàng bảo quản."
    },
    {
        id: 3,
        name: "Hoodie Streetwear",
        price: 899000,
        image: hoodieStreetwear, // 2. Sử dụng biến đã import
        category: "ao-hoodie",
        description: "Hoodie phong cách streetwear, chất liệu nỉ dày dặn, giữ ấm tốt, thiết kế trẻ trung."
    },
    {
        id: 4,
        name: "Áo Khoác Bomber",
        price: 1299000,
        image: aoKhoacBomber, // 2. Sử dụng biến đã import
        category: "ao-khoac",
        description: "Áo khoác bomber thời trang, thiết kế hiện đại, chất liệu cao cấp, phù hợp cho mùa thu đông."
    },
    {
        id: 5,
        name: "Áo Thun Polo",
        price: 459000,
        image: aoThunPolo, // 2. Sử dụng biến đã import
        category: "ao-thun",
        description: "Áo thun polo lịch lãm, phù hợp cho cả công sở và dạo phố, chất liệu cotton pha."
    },
    {
        id: 6,
        name: "Áo Sơ Mi Kẻ Sọc",
        price: 649000,
        image: soMiKeSoc, // 2. Sử dụng biến đã import
        category: "ao-so-mi",
        description: "Áo sơ mi họa tiết kẻ sọc thanh lịch, form dáng slim fit, tôn dáng người mặc."
    },
    {
        id: 7,
        name: "Hoodie Zip-Up",
        price: 799000,
        image: hoodieZipUp, // 2. Sử dụng biến đã import
        category: "ao-hoodie",
        description: "Hoodie có khóa kéo tiện lợi, chất liệu nỉ bông mềm mại, màu sắc trẻ trung."
    },
    {
        id: 8,
        name: "Áo Khoác Denim",
        price: 949000,
        image: aoKhoacDenim, // 2. Sử dụng biến đã import
        category: "ao-khoac",
        description: "Áo khoác jeans cổ điển, chất liệu denim cao cấp, phong cách bất biến theo thời gian."
    }
];