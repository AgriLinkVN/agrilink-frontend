"use client";

import React, { useState, useMemo } from 'react';
import * as d3Geo from 'd3-geo';
import { motion, AnimatePresence } from 'framer-motion';

// Import the GeoJSON data we downloaded
import geoData from '@/components/vietnam-provinces.json';

interface HoverData {
  provinceName: string;
  production: string;
  fruits: string[];
  x: number;
  y: number;
}

// Mock data generator for provinces
const getProvinceData = (name: string) => {
  const dataMap: Record<string, { production: string, fruits: string[] }> = {
    "Tỉnh Lâm Đồng": { production: "2.5 triệu tấn", fruits: ["Cà phê", "Rau sạch", "Bơ", "Sầu riêng"] },
    "Tỉnh Đắk Lắk": { production: "1.8 triệu tấn", fruits: ["Cà phê", "Tiêu", "Bơ"] },
    "Tỉnh Tiền Giang": { production: "1.2 triệu tấn", fruits: ["Xoài cát", "Sầu riêng", "Bưởi"] },
    "Tỉnh Sơn La": { production: "800 ngàn tấn", fruits: ["Mận", "Nhãn", "Chanh dây"] },
    "Tỉnh Bắc Giang": { production: "600 ngàn tấn", fruits: ["Vải thiều", "Cam"] },
    "Tỉnh Sóc Trăng": { production: "1.5 triệu tấn", fruits: ["Gạo ST25", "Hành tím"] },
    "Tỉnh Đồng Tháp": { production: "1.7 triệu tấn", fruits: ["Xoài", "Lúa gạo", "Sen"] },
  };
  
  // Clean name encoding if needed or match substrings
  const matchedKey = Object.keys(dataMap).find(k => name.includes(k.replace("Tỉnh ", "")));
  
  if (matchedKey) return dataMap[matchedKey];
  
  // Default mock data for others
  return {
    production: `${Math.floor(Math.random() * 900) + 100} ngàn tấn`,
    fruits: ["Lúa gạo", "Hoa quả nhiệt đới"]
  };
};

export function VietnamMap() {
  const [hoveredProvince, setHoveredProvince] = useState<HoverData | null>(null);

  // Setup D3 projection
  // Vietnam coordinates approx bounds: Longitude 102 to 110, Latitude 8 to 24
  const projection = useMemo(() => {
    return d3Geo.geoMercator()
      // Center roughly over Vietnam
      .center([106, 16])
      // Adjust scale to fit the container
      .scale(2200)
      // Translate to the center of our SVG viewBox
      .translate([250, 350]);
  }, []);

  const pathGenerator = d3Geo.geoPath().projection(projection);

  // Fix encoding issues in province names from the JSON
  const fixEncoding = (str: string) => {
    try {
      return decodeURIComponent(escape(str));
    } catch {
      return str;
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<SVGPathElement>, feature: Record<string, unknown>) => {
    const properties = feature.properties as Record<string, unknown>;
    const rawName = (properties?.Name as string) || (properties?.Ten as string) || "Không rõ";
    const cleanName = fixEncoding(rawName);
    
    setHoveredProvince({
      provinceName: cleanName,
      ...getProvinceData(cleanName),
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseLeave = () => {
    setHoveredProvince(null);
  };

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[600px] flex items-center justify-center bg-[#F9FAF8] rounded-3xl p-4 overflow-hidden border border-gray-100 shadow-inner">
      <svg 
        viewBox="0 0 500 700" 
        className="w-full h-full max-h-[600px] drop-shadow-xl"
        preserveAspectRatio="xMidYMid meet"
      >
        <g stroke="#1E3A2B" strokeWidth="0.5" strokeLinejoin="round" strokeLinecap="round">
          {geoData.features.map((feature: Record<string, unknown>, i: number) => {
            const properties = feature.properties as Record<string, unknown>;
            const isHovered = hoveredProvince?.provinceName === fixEncoding((properties?.Name as string) || (properties?.Ten as string));
            
            return (
              <path
                key={`province-${i}`}
                d={pathGenerator(feature as any) || ""}
                fill={isHovered ? "#CCFF00" : "#EAEFE5"}
                className="transition-colors duration-200 cursor-pointer outline-none"
                onMouseEnter={(e) => handleMouseEnter(e, feature as any)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={(e) => {
                  if (hoveredProvince) {
                    setHoveredProvince({
                      ...hoveredProvince,
                      x: e.clientX,
                      y: e.clientY
                    });
                  }
                }}
              />
            );
          })}
        </g>
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredProvince && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 pointer-events-none bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 min-w-[200px]"
            style={{
              left: hoveredProvince.x + 15,
              top: hoveredProvince.y - 40,
            }}
          >
            <h3 className="font-bold text-[#1E3A2B] text-lg mb-2 border-b border-gray-100 pb-2">
              {hoveredProvince.provinceName}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Sản lượng:</span>
                <span className="font-semibold text-[#1E3A2B]">{hoveredProvince.production}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Nông sản chủ lực:</span>
                <div className="flex flex-wrap gap-1">
                  {hoveredProvince.fruits.map(fruit => (
                    <span key={fruit} className="bg-lime-50 text-green-700 px-2 py-0.5 rounded-md text-xs font-medium border border-lime-100">
                      {fruit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Decorative dots / legend */}
      <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur p-4 rounded-2xl border border-gray-100 shadow-sm pointer-events-none">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bản đồ Nông sản</h4>
        <div className="flex items-center gap-2 text-sm text-[#1E3A2B]">
          <span className="w-3 h-3 rounded-full bg-[#EAEFE5] border border-[#1E3A2B]/20"></span>
          <span>Vùng canh tác</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#1E3A2B] mt-1">
          <span className="w-3 h-3 rounded-full bg-[#CCFF00] border border-[#1E3A2B]/20 shadow-sm"></span>
          <span className="font-medium">Đang tương tác</span>
        </div>
      </div>
    </div>
  );
}
