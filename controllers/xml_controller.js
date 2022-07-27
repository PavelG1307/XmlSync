const { encode } = require('punycode');
const builder = require('xmlbuilder');
const fs = require('fs');
const path = require('path')

class XML_Controller{

    constructor(users, db){
        this.users = users
        this.db = db
        this.xmls = {}
    }


    async create_XML(user_hash){
        const root = builder.create('Ads').att({'formatVersion': 3, 'target': 'Avito.ru'})
        this.xmls.user_hash = root
    }


    async add_ad_in_XML(ad, user_hash){
        const ad_xml = this.xmls.user_hash.ele('Ad')
        ad_xml.ele('Id',ad.uuid)
        const date = new Date(parseInt(ad.creation_timestamp))

        const date_begin = date.getFullYear() + '-' + (date.getMonth()+1)+ "-" + date.getDate()
        + "T" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + '+03:00'

        ad_xml.ele('DateBegin', date_begin)
        const description = ad.description + '\nAvitoId: ' + ad.avito_id
        ad_xml.ele('Description', description)
        ad_xml.ele('Address', ad.address)
        ad_xml.ele('Latitude', ad.coords[0])
        ad_xml.ele('Longitude', ad.coords[1])
        ad_xml.ele('Category', 'Коммерческая недвижимость')
        ad_xml.ele('OperationType', 'Сдам')
        ad_xml.ele('Title', ad.name)
        ad_xml.ele('Price', ad.price)
        let price_type
        if (ad.interval=='month') {
            price_type = 'в месяц'
        } else {
            price_type = 'в год'
        }
        ad_xml.ele('PriceType', price_type)
        ad_xml.ele('Square', ad.capacity)
        ad_xml.ele('PropertyRights', 'Собственник')
        ad_xml.ele('ObjectType', 'Складское помещение')
        ad_xml.ele('RentalType', 'Прямая')
        
        try{
            const images = ad['files']['images']
            console.log(ad['files'])
            console.log(images)
            const im_xml = ad_xml.ele('Images')
            for (i in images) {
                im_xml.ele('Image', {'url': images[i]})
            }
        } catch(e) {
            console.log('No images')
            console.log(e)
        }

        await this.add(ad,ad_xml,'BuildingClass',
            ['e3b0f540-c512-429b-b0ea-b8fbdafe7cd1','4b2064d1-858d-4205-b3ca-8f88ecb86b13', 'ed08f23e-f88e-4607-8042-2ec32a09f0b6', 'c2f1deb1-be56-496a-a8b2-e1ea96471496'],
            ['A', 'B', 'C', 'D'])

        await this.add(ad,ad_xml,'Decoration',
        ['3c5f3bce-f0b7-4d39-9e80-45206cf55ff6', '35fc8a59-bdc5-4c6e-bb9f-841681e51587','1fea5619-9e8a-4dda-b35d-f62255e5d54a'],
        ['Без отделки', 'Офисная', 'Чистовая'])

        await this.add(ad,ad_xml,'Floor',
        ['b2816f98-d28f-4610-a981-957ebb76939b',
        '5824a694-e72d-44aa-8b31-a55c08cc51a5',
        '5f74c29c-73e4-43e8-a3a9-a3b55089c409',
        'd1944e03-6fb5-4745-894c-9c916ece418b',
        'db50a7c2-d7e9-4085-94d0-a8d18e8fd87b',
        '15b6eed9-d018-4f99-8d55-8ad74a165435',
        '8abfd231-2387-4634-890c-01a19fa41192',
        'af7f6087-9e9a-4992-b8be-98b1ea5db2c6',
        '38b29cab-8f98-493f-8d3b-b872dbdde27e',
        'c703b2c3-a0dd-4508-8840-10b35d415f6a',
        '10eec728-01c7-44df-a656-8d686d54e901',
        '59157225-b8ba-4e6f-aa09-b818f6296d26'],
        ['1','2','3','4','5','6','7','8','9','10','Подвальный','Цокольный'])

        await this.add(ad,ad_xml,'BuildingType',
        ['3f702a42-70d9-4394-ad4d-67af58f7b36d',
        '85fe14a0-0d21-4e9f-aa17-51890e29bfa0',
        '67d1ef27-7ec0-4001-b301-6a08e5ab7319',
        'e5fe4a50-0294-4c3a-b087-6bfeb4c77463',
        '2339bfc7-eb5a-4397-9be4-b3630f017156'],
        ['Административное здание',
        'Бизнес-центр',
        'Жилой дом',
        'Торговый центр',
        'Другой']
        )

        await this.add(ad, ad_xml,'Entrance',
            ['ca7fa12e-c3be-40a1-aa82-1216959b6eb9',
            'e7478717-7b4c-4251-bd87-7d8b8b52bfa6'],
            ['Со двора', 'С улицы']
        )

        await this.add(ad, ad_xml,'ParkingType',
        ['8a5c1034-a093-43bd-9016-18211fe1538a',
        '867eb8a5-eb5a-499b-ab13-f386d0f5914b',
        '983c35e2-225b-4aee-a78d-82a6dc097e79'],
        ['Нет','На улице', 'В здании'])

        const class_uuid = ['15e3825a-5bfb-4d1e-af7f-5989da06d4c9',
        '30030a3c-3934-495d-8799-6807de1fe103',
        '479f4d74-8938-4c12-9e03-eed04a9d40e1']

        for (const i in class_uuid){
            const n = ad.parents.indexOf(class_uuid[i])
            if (n == 0){
                ad_xml.ele('ParkingAdditionally').ele('Option', 'Бесплатная')
            } else if (n == 1) {
                const p_type = ad_xml.ele('ParkingAdditionally')
                p_type.ele('Option', 'Бесплатная')
                p_type.ele('Option', 'Подходит для грузового транспорта')
            }

        }

        await this.add(ad,ad_xml,'EntranceAdditionally', ['22c779ef-a2ae-43e1-bb99-6067e43d4c1e'], ['Отдельный вход'])
        
        await this.add(ad,ad_xml,'CeilingHeight',
        ['d0818df2-a805-4904-9d48-32bb4710cbd7',
        '8ef71156-08de-4fd3-8994-72573f10f041',
        '56f76e7b-4cd1-401d-b2fc-419cbf55c638',
        'f0081ecd-0999-4f3f-8a88-976ac84ce524',
        '9b16fbb6-48a2-4bca-b431-de0d99396928'],
        [1,2,3,4,5])

        await this.add(ad,ad_xml,'LeaseDeposit',
        ['d2ddd2a6-d49e-4393-a4bd-a9ce50ec5e66',
        'f4698aa3-0e93-4a9b-9773-4548a58a7970',
        '08522d21-3f77-4b89-a5a7-1762bbc0ef48',
        'c77e0eca-39fe-4ec3-bfd0-0fdd6b67ffd9',
        '390b4521-055f-41d1-b2c4-ab6a80e58990',
        '9da7bbe9-9c0a-4aab-8725-b5e80560e990'],
        ['Без залога','0,5  месяца','1 месяц','1,5 месяца','2 месяца','3 месяца'])
        

    }


    async add(ad, xml, title, uuid, value){
        for (const i in uuid){
            const n = ad.parents.indexOf(uuid[i])
            if (n!=-1) {
                xml.ele(title, value[i])
            }
        }
    }


    async get_XML(user_hash){
        return this.xmls.user_hash.end({ pretty: true})
    }


    async refresh(user_hash){
        try{
            const ads = await this.db.get_ads(user_hash)
            await this.create_XML(user_hash)
            for (const i in ads){
                await this.add_ad_in_XML(ads[i], user_hash)
            }
            const xml = await this.get_XML(user_hash)
            const file = await this.save(xml, user_hash)
            return file
        } catch(e){
            console.log(e)
            return false
        }
    }


    async uuid_to_hash(user_uuid){
        return this.db.get_user(user_uuid)
    }


    async save(data, user_hash){
        const filename = './xml_files/' + user_hash + '.xml'
        fs.writeFile(filename, data, 'utf-8', ()=>{})
        return filename
    }


    async refresh_all(){
        let error = false
        for (const i in this.users) {
            if (!(await this.refresh(this.users[i]))) {
                error = true
            }
        }
        if (!error) {
            return {'status': 'ok'}
        } else {
            return {'status': 'bad requests'}
        }
    }
    
    async add_user(hash){
        if (this.users.indexOf(hash)==-1){
            this.users.push(hash)
            if (await this.refresh(hash)) {
                return {'status': 'ok'}
            } else {
                return {'status': 'bad requests'}
            }
        } else {
            return {'status': 'bad requests'}
        }
    }

    async update_all(){
        if (await this.refresh_all()) {
            return {'status':'ok'}
        } else {
            return {'status':'bad requests'}
        }
    }

    async update_user(hash){
        if (await this.refresh(hash)) {
            return {'status': 'ok'}
        } else {
            return {'status': 'bad requests'}
        }
    }

    async remove_user(hash){
        try{
            this.users.pop(this.users.indexOf(hash))
            const filename = './xml_files/' + hash + '.xml'
            fs.unlinkSync(filename)
            return {'status':'ok'}
        } catch(e) {
            console.log(e)
            return {'status':'bad requests'}
        }
    }

    async get_all(){
        const res = {'status':'ok', 'data': []}
        for (const i in this.users) {
            res.data.push(this.users[i])
        }
        return res
    }
}

module.exports = XML_Controller

