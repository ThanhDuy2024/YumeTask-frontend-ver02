import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { profile } from "@/services/auth/profileService";

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: profile,
    retry: false,
  });
  console.log("PROFILE DATA:", data);

  const [previewImage, setPreviewImage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());

    const file = formData.get("image");
    if (file && file.name) {
      values.image = file;
    } else {
      values.image = mockProfile.image;
    }

    console.log("DATA SUBMIT:", values);

    toast.success("Cập nhật thông tin thành công!");
  };

  return (
    <main className="max-w-7xl mx-auto mt-8 bg-white rounded-xl shadow-md overflow-hidden border mt-10">
      <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-800 border-b">
        Thông tin tài khoản
      </div>

      <form className="flex p-6 gap-6" onSubmit={handleSubmit}>
        {/* Ảnh */}
        <div className="flex flex-col items-center gap-3">
          <img
            src={previewImage || data?.data?.image}
            alt=""
            className="w-40 h-48 object-cover border rounded-md cursor-pointer hover:opacity-80"
            onClick={() => fileInputRef.current.click()}
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setPreviewImage(URL.createObjectURL(file));
              }
            }}
          />
          <p className="text-xs text-gray-500">Click vào ảnh để đổi</p>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4 text-sm w-full">
          <div>
            <label className="font-semibold block mb-1">Tên hiển thị:</label>
            <input
              type="text"
              name="userName"
              defaultValue={data?.data?.userName}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Email:</label>
            <input
              type="email"
              name="email"
              defaultValue={data?.data?.email}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Ngày tạo:</label>
            <input
              type="text"
              value={data?.data?.createdAt}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">
              Cập nhật lần cuối:
            </label>
            <input
              type="text"
              value={data?.data?.updatedAt}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              <Save size={18} />
              Cập nhật
            </button>

            <button
              type="button"
              onClick={() => navigate("/task")}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              <X size={18} />
              Đóng
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
