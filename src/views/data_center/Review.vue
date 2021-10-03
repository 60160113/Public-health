<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong class="text-primary">ตรวจสอบความถูกต้อง</strong>
      </CCardHeader>

      <CCardBody>
        <CDataTable
          :items="requests"
          :fields="[
            { key: 'requester', label: 'Requester', _style: 'width:20%' },
            { key: 'position', label: 'Position', _style: 'width:10%' },
            {
              key: 'affiliation',
              label: 'Affiliation',
              _style: 'width:10%',
            },
            { key: 'purpose', label: 'Purpose', _style: 'width:15%' },
            { key: 'date', label: 'Date', _style: 'width:10%' },
            {
              key: 'returnDate',
              label: 'Return Date',
              _style: 'width:10%',
            },
            { key: 'checkInCard', label: 'Card', _style: 'width:15%' },
            { key: 'action', label: 'Action', _style: 'width:10%' },
          ]"
          :tableFilter="{
            label: 'ค้นหา: ',
            placeholder: 'ค้นหา',
          }"
          pagination
          :items-per-page="5"
          :itemsPerPageSelect="{
            label: 'แสดง',
          }"
          :loading="loading"
          hover
          striped
          border
        >
          <template #no-items-view
            ><div class="text-center">ไม่พบข้อมูล</div>
          </template>

          <template #action>
            <td>
              <CButton color="success" shape="pill"> อนุมัติ </CButton>
              &nbsp;
              <CButton color="danger" shape="pill"> ปฏิเสธ </CButton>
            </td>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
export default {
  data() {
    return {
      requests: [],
    };
  },
};
</script>