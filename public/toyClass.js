export default class ToyClass {
    constructor(_parent, _item, _index, _doApi) {
        this.parent = _parent;
        this.name = _item.name;
        this.info = _item.info;
        this.category = _item.category;
        this.img = _item.img_url;
        this.price = _item.price;
        this.user_id = _item._user_id;
        this.doApi = _doApi;
        this.index = _index;
    }

    render() {
        let tr = document.createElement("tr");
        document.querySelector(this.parent).append(tr);

        tr.innerHTML = `
      <td>${this.index + 1}</td>
      <td>${this.name}</td>
      <td>${this.pop.toLocaleString()}</td>
      <td>${this.capital}</td>
      <td><button class="badge bg-danger del-btn">Del</button></td>
      `

        let delBtn = tr.querySelector(".del-btn");
        delBtn.addEventListener("click", () => {
            // alert(this.id);
            confirm("Are you sure you want to delete?") && this.delCountry()
        })
    }

}