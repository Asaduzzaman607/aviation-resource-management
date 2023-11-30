import axiosInstance from '../../../service/Api';

const ScrapPartService = {
  async fetchSerialsByPartId(partId) {
    if (!partId) return [];
    try {
      const res = await axiosInstance.post('/store_part_serial/search', {
        partId,
        onlyAvailable: true,
      });
      return res.data.model;
    } catch (e) {
      return [];
    }
  },
};

export default ScrapPartService;
