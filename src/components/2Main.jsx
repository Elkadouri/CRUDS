import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { useState, useEffect } from "react";

export default function Main() {
  const [info, setInfo] = useState({
    id: "",
    title: "",
    price: "",
    taxes: "",
    ads: "",
    discount: "",
    total: "",
    count: "",
    category: "",
  });

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // حالة لتخزين البيانات المفلترة

  useEffect(() => {
    calculTotal();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.price, info.taxes, info.ads, info.discount]);

  function calculTotal() {
    if (info.title !== "" && info.price !== "") {
      const total = (
        +info.price +
        +info.taxes +
        +info.ads -
        +info.discount
      ).toFixed(2);
      setInfo((prevInfo) => ({ ...prevInfo, total: total }));
    }
  }

  useEffect(() => {
    const storedData = localStorage.getItem("tableData")
      ? JSON.parse(localStorage.getItem("tableData"))
      : [];
    setData(storedData);
    setFilteredData(storedData); // تهيئة البيانات المفلترة
  }, []);

  function create() {
    if (info.title !== "" && info.price !== "" && info.category !== "") {
      const newData = [...data];
      const newId = newData.length ? newData[newData.length - 1].id + 1 : 1;

      if (info.count === "" || +info.count <= 1) {
        newData.push({ ...info, id: newId, total: info.total });
      } else {
        for (let i = 1; i <= info.count; i++) {
          newData.push({ ...info, id: newId + i - 1, total: info.total });
        }
      }

      setData(newData);
      setFilteredData(newData); // تحديث البيانات المفلترة أيضًا
      localStorage.setItem("tableData", JSON.stringify(newData));
    }
    setTimeout(() => {
      setInfo({
        id: "",
        title: "",
        price: "",
        taxes: "",
        ads: "",
        discount: "",
        total: "",
        count: "",
        category: "",
      });
    }, 1000);
  }

  function deleteAll() {
    localStorage.removeItem("tableData");
    setData([]);
    setFilteredData([]); // مسح البيانات المفلترة
  }

  function deleteItem(i) {
    const newData = data.filter((obj) => {
      return obj.id !== i; // فلترة البيانات لحذف العنصر
    });
    setData(newData);
    setFilteredData(newData); // تحديث البيانات المفلترة
    localStorage.setItem("tableData", JSON.stringify(newData));
  }

  const [createOrUpdate, setCreateOrUpdate] = useState("create");

  function update() {
    const newData = data.map((obj) => {
      if (obj.id === info.id) {
        return { ...info }; // تحديث البيانات للعنصر المحدد
      } else {
        return obj;
      }
    });

    setData(newData);
    setFilteredData(newData); // تحديث البيانات المفلترة
    localStorage.setItem("tableData", JSON.stringify(newData));

    setTimeout(() => {
      setCreateOrUpdate("create");
      setInfo({
        id: "",
        title: "",
        price: "",
        taxes: "",
        ads: "",
        discount: "",
        total: "",
        count: "",
        category: "",
      });
    }, 1000);
  }

  function showObjInfo(i) {
    setCreateOrUpdate("update");

    const newInfo = data.find((obj) => {
      return obj.id === i; // العثور على العنصر المطلوب
    });

    setInfo({ ...newInfo, count: "" });
  }

  const [titleOrCategory, setTitleOrCategory] = useState("title");
  const [searchValue, setSearchValue] = useState("");

  function handleSearch() {
    if (searchValue === "") {
      setFilteredData(data); // إظهار جميع المنتجات إذا كانت قيمة البحث فارغة
    } else {
      const newData = data.filter((obj) => {
        return obj[titleOrCategory]
          .toLowerCase()
          .includes(searchValue.toLowerCase()); // فلترة البيانات بناءً على البحث
      });
      setFilteredData(newData); // تعيين البيانات المفلترة بناءً على البحث
    }
  }

  useEffect(() => {
    handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, titleOrCategory, data]); // أيضًا تفعيل عند تغيير البيانات

  return (
    <main>
      <div className="info">
        <input
          autoComplete="off"
          value={info.title}
          onChange={(e) => setInfo({ ...info, title: e.target.value })}
          className="wfull"
          type="text"
          placeholder="Title"
          name="title"
        />

        <div className="four-inputs">
          <input
            autoComplete="off"
            value={info.price}
            onChange={(e) => setInfo({ ...info, price: e.target.value })}
            type="number"
            placeholder="Price"
            name="price"
          />
          <input
            autoComplete="off"
            value={info.taxes}
            onChange={(e) => setInfo({ ...info, taxes: e.target.value })}
            type="number"
            placeholder="Taxes"
            name="taxes"
          />
          <input
            autoComplete="off"
            value={info.ads}
            onChange={(e) => setInfo({ ...info, ads: e.target.value })}
            type="number"
            placeholder="Ads"
            name="ads"
          />
          <input
            autoComplete="off"
            value={info.discount}
            onChange={(e) => setInfo({ ...info, discount: e.target.value })}
            type="number"
            placeholder="Discount"
            name="discount"
          />
        </div>

        <span
          className={`total ${
            info.title !== "" && info.price !== "" ? "active" : ""
          }`}
        >
          Total: ${info.total || "0.00"}
        </span>

        <input
          autoComplete="off"
          disabled={createOrUpdate === "create" ? false : true}
          value={info.count}
          onChange={(e) => setInfo({ ...info, count: e.target.value })}
          className="wfull"
          type="number"
          placeholder="Count"
          name="count"
        />
        <input
          autoComplete="off"
          value={info.category}
          onChange={(e) => setInfo({ ...info, category: e.target.value })}
          className="wfull"
          type="text"
          placeholder="Category"
          name="category"
        />

        <button
          className="create-or-update"
          onClick={() => {
            if (createOrUpdate === "create") {
              create();
            } else {
              update();
            }
          }}
        >
          {createOrUpdate}
        </button>

        <input
          autoComplete="off"
          className="wfull"
          type="text"
          placeholder={`Search by ${titleOrCategory}`}
          name={titleOrCategory}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
        <div className="search-btns">
          <button onClick={() => setTitleOrCategory("title")}>
            Search by title
          </button>
          <button onClick={() => setTitleOrCategory("category")}>
            Search by category
          </button>
        </div>

        {filteredData.length > 0 && (
          <button className="delete-all" onClick={() => deleteAll()}>
            Delete All ({filteredData.length})
          </button>
        )}

        {filteredData.length > 0 && (
          <div className="table-container">
            <table className="data">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Taxes</th>
                  <th>Ads</th>
                  <th>Discount</th>
                  <th>Total</th>
                  <th>Category</th>
                  <th>Update</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((obj, i) => (
                  <tr key={obj.id || i + 1} id={i}>
                    <td>{i + 1}</td>
                    <td>{obj.title}</td>
                    <td>{obj.price}</td>
                    <td>{obj.taxes || "x"}</td>
                    <td>{obj.ads || "x"}</td>
                    <td>{obj.discount || "x"}</td>
                    <td>${obj.total}</td>
                    <td>{obj.category}</td>
                    <td>
                      <button
                        id="update"
                        onClick={() => {
                          setCreateOrUpdate("update");
                          showObjInfo(obj.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faPencil} />
                      </button>
                    </td>
                    <td>
                      <button id="delete" onClick={() => deleteItem(obj.id)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
