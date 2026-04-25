export const fetchProvinces = async (provinces: any) => {
    try {
        const response = await fetch('https://provinces.open-api.vn/api/');
        const data = await response.json();

        provinces.value = data.map((prov: any) => ({
            code: prov.code,
            name: prov.name.replace('Tỉnh ', '').replace('Thành phố ', '').trim()
        }));
    } catch (error) {
        console.error("Lỗi khi fetch danh sách tỉnh thành:", error);
    }
};