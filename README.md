# AutoLoad
#### Install:

Для работы модуля нужен Node JS

------------



#### Run
Для запуска выполните команду:
`npm start`

------------



#### Usage


##### Подключение автозагрузки:

Для автозагрузки объявлений конретного пользователя необходимо отправить следующий GET запрос:
`/api/xml/add/ID_HASH_USER`

ID_HASH_USER можно получить из ссылки на страницу профиля авито, например:
`https://www.avito.ru/user/c6c5eaa1421b9335f9c2696ae9d40a24/profile?id=2435393350&src=item&page_from=from_item_card&iid=2435393350`

`ID_HASH_USER = c6c5eaa1421b9335f9c2696ae9d40a24`


##### Отключение автозагрузки:

`/api/xml/remove/ID_HASH_USER`


##### Принудительное обновление xml файла:

`/api/xml/update/ID_HASH_USER`

##### Пример ответов

`{'status': 'ok'`
где status принимает значения: ok и bad request

##### Получение списка пользователей с автозагрузкой:

`/api/xml/get`

##### Пример ответа

```json
{
	"status":"ok",
	"data":["00356b7cf848dc845d846edf3ccade93", "0417a09bc909087c0a7f649a40ddddb1"]
}
```


