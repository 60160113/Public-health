<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong class="text-primary">รายการ Hardwares</strong>
      </CCardHeader>

      <CCardBody
        ><CDataTable
          :items="hardwareList"
          :fields="[
            { key: 'name', label: 'Name', _style: 'width:25%' },
            { key: 'brand', label: 'Brand', _style: 'width:10%' },
            {
              key: 'serialNumber',
              label: 'Serial Number',
              _style: 'width:10%',
            },
            { key: 'unit', label: 'Unit', _style: 'width:15%' },
            { key: 'direction', label: 'Direction', _style: 'width:15%' },
            { key: 'type', label: 'Type', _style: 'width:15%' },
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
          hover
          striped
          border
        >
          <template #no-items-view
            ><div class="text-center">ไม่พบข้อมูล</div>
          </template>
          <template #over-table>
            <div style="margin-bottom: 10px">
              <CButton color="primary" shape="pill" @click="modal = true">
                เพิ่ม
              </CButton>
            </div>
          </template>
          <template #action="{ index }">
            <td>
              <CButton
                color="danger"
                shape="pill"
                @click="hardwareList.splice(index, 1)"
              >
                ลบ
              </CButton>
            </td>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>