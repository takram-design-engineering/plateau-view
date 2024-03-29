export interface CensusDatasetDatum {
  column: number
  name: string
}

export interface CensusDataset {
  name: string
  urlTemplate: string
  data: readonly CensusDatasetDatum[]
}

export const censusDatasets: CensusDataset[] = [
  {
    name: '国勢調査 人口及び世帯',
    urlTemplate: '/estat/T001102/tblT001102Q{code}.csv',
    data: [
      { column: 4, name: '人口（総数）' },
      { column: 5, name: '人口（総数） 男' },
      { column: 6, name: '人口（総数） 女' },
      { column: 7, name: '0～14歳人口 総数' },
      { column: 8, name: '0～14歳人口 男' },
      { column: 9, name: '0～14歳人口 女' },
      { column: 10, name: '15歳以上人口 総数' },
      { column: 11, name: '15歳以上人口 男' },
      { column: 12, name: '15歳以上人口 女' },
      { column: 13, name: '15～64歳人口 総数' },
      { column: 14, name: '15～64歳人口 男' },
      { column: 15, name: '15～64歳人口 女' },
      { column: 16, name: '18歳以上人口 総数' },
      { column: 17, name: '18歳以上人口 男' },
      { column: 18, name: '18歳以上人口 女' },
      { column: 19, name: '20歳以上人口 総数' },
      { column: 20, name: '20歳以上人口 男' },
      { column: 21, name: '20歳以上人口 女' },
      { column: 22, name: '65歳以上人口 総数' },
      { column: 23, name: '65歳以上人口 男' },
      { column: 24, name: '65歳以上人口 女' },
      { column: 25, name: '75歳以上人口 総数' },
      { column: 26, name: '75歳以上人口 男' },
      { column: 27, name: '75歳以上人口 女' },
      { column: 28, name: '85歳以上人口 総数' },
      { column: 29, name: '85歳以上人口 男' },
      { column: 30, name: '85歳以上人口 女' },
      { column: 31, name: '95歳以上人口 総数' },
      { column: 32, name: '95歳以上人口 男' },
      { column: 33, name: '95歳以上人口 女' },
      { column: 34, name: '外国人人口 総数' },
      { column: 35, name: '外国人人口 男' },
      { column: 36, name: '外国人人口 女' },
      { column: 37, name: '世帯総数' },
      { column: 38, name: '一般世帯数' },
      { column: 39, name: '1人世帯数 一般世帯数' },
      { column: 40, name: '2人世帯数 一般世帯数' },
      { column: 41, name: '3人世帯数 一般世帯数' },
      { column: 42, name: '4人世帯数 一般世帯数' },
      { column: 43, name: '5人世帯数 一般世帯数' },
      { column: 44, name: '6人世帯数 一般世帯数' },
      { column: 45, name: '7人以上世帯数 一般世帯数' },
      { column: 46, name: '親族のみの世帯数 一般世帯数' },
      { column: 47, name: '核家族世帯数 一般世帯数' },
      { column: 48, name: '核家族以外の世帯数 一般世帯数' },
      { column: 49, name: '6歳未満世帯員のいる世帯数 一般世帯数' },
      { column: 50, name: '65歳以上世帯員のいる世帯数 一般世帯数' },
      { column: 51, name: '世帯主の年齢が20～29歳の1人世帯数 一般世帯数' },
      { column: 52, name: '高齢単身世帯数 一般世帯数' },
      { column: 53, name: '高齢夫婦世帯数 一般世帯数' }
    ]
  },
  {
    name: '国勢調査 人口移動、就業状態等及び従業地・通学地',
    urlTemplate: '/estat/T001109/tblT001109Q{code}.csv',
    data: [
      { column: 4, name: '雇用者（役員を含む）総数' },
      { column: 5, name: '雇用者（役員を含む）男' },
      { column: 6, name: '雇用者（役員を含む）女' },
      { column: 7, name: '正規の職員・従業員 総数' },
      { column: 8, name: '正規の職員・従業員 男' },
      { column: 9, name: '正規の職員・従業員 女' },
      { column: 10, name: '労働者派遣事業所の派遣社員 総数' },
      { column: 11, name: '労働者派遣事業所の派遣社員 男' },
      { column: 12, name: '労働者派遣事業所の派遣社員 女' },
      { column: 13, name: 'パート・アルバイト・その他 総数' },
      { column: 14, name: 'パート・アルバイト・その他 男' },
      { column: 15, name: 'パート・アルバイト・その他 女' },
      { column: 16, name: '自営業主 総数' },
      { column: 17, name: '自営業主 男' },
      { column: 18, name: '自営業主 女' },
      { column: 19, name: '家族従業者 総数' },
      { column: 20, name: '家族従業者 男' },
      { column: 21, name: '家族従業者 女' },
      { column: 22, name: '未就学者 総数' },
      { column: 23, name: '未就学者 男' },
      { column: 24, name: '未就学者 女' },
      { column: 25, name: '未就学者うち 幼稚園 総数' },
      { column: 26, name: '未就学者うち 幼稚園 男' },
      { column: 27, name: '未就学者うち 幼稚園 女' },
      { column: 28, name: '未就学者うち 保育園・保育所 総数' },
      { column: 29, name: '未就学者うち 保育園・保育所 男' },
      { column: 30, name: '未就学者うち 保育園・保育所 女' },
      { column: 31, name: '未就学者うち 認定こども園 総数' },
      { column: 32, name: '未就学者うち 認定こども園 男' },
      { column: 33, name: '未就学者うち 認定こども園 女' },
      { column: 34, name: '未就学者うち その他 総数' },
      { column: 35, name: '未就学者うち その他 男' },
      { column: 36, name: '未就学者うち その他 女' },
      { column: 37, name: '在学者 総数' },
      { column: 38, name: '在学者 男' },
      { column: 39, name: '在学者 女' },
      { column: 40, name: '在学者うち 小学校・中学校 総数' },
      { column: 41, name: '在学者うち 小学校・中学校 男' },
      { column: 42, name: '在学者うち 小学校・中学校 女' },
      { column: 43, name: '在学者うち 高校 総数' },
      { column: 44, name: '在学者うち 高校 男' },
      { column: 45, name: '在学者うち 高校 女' },
      { column: 46, name: '在学者うち 短大・高専 総数' },
      { column: 47, name: '在学者うち 短大・高専 男' },
      { column: 48, name: '在学者うち 短大・高専 女' },
      { column: 49, name: '在学者うち 大学・大学院 総数' },
      { column: 50, name: '在学者うち 大学・大学院 男' },
      { column: 51, name: '在学者うち 大学・大学院 女' },
      { column: 52, name: '最終卒業学校卒業者 総数' },
      { column: 53, name: '最終卒業学校卒業者 男' },
      { column: 54, name: '最終卒業学校卒業者 女' },
      { column: 55, name: '最終卒業学校卒業者うち 小学校・中学校 総数' },
      { column: 56, name: '最終卒業学校卒業者うち 小学校・中学校 男' },
      { column: 57, name: '最終卒業学校卒業者うち 小学校・中学校 女' },
      { column: 58, name: '最終卒業学校卒業者うち 高校・旧中 総数' },
      { column: 59, name: '最終卒業学校卒業者うち 高校・旧中 男' },
      { column: 60, name: '最終卒業学校卒業者うち 高校・旧中 女' },
      { column: 61, name: '最終卒業学校卒業者うち 短大・高専 総数' },
      { column: 62, name: '最終卒業学校卒業者うち 短大・高専 男' },
      { column: 63, name: '最終卒業学校卒業者うち 短大・高専 女' },
      { column: 64, name: '最終卒業学校卒業者うち 大学・大学院 総数' },
      { column: 65, name: '最終卒業学校卒業者うち 大学・大学院 男' },
      { column: 66, name: '最終卒業学校卒業者うち 大学・大学院 女' },
      { column: 67, name: '居住期間 出生時から 総数' },
      { column: 68, name: '居住期間 出生時から 男' },
      { column: 69, name: '居住期間 出生時から 女' },
      { column: 70, name: '居住期間 1年未満 総数' },
      { column: 71, name: '居住期間 1年未満 男' },
      { column: 72, name: '居住期間 1年未満 女' },
      { column: 73, name: '居住期間 1～5年未満 総数' },
      { column: 74, name: '居住期間 1～5年未満 男' },
      { column: 75, name: '居住期間 1～5年未満 女' },
      { column: 76, name: '居住期間 5～10年未満 総数' },
      { column: 77, name: '居住期間 5～10年未満 男' },
      { column: 78, name: '居住期間 5～10年未満 女' },
      { column: 79, name: '居住期間 10～20年未満 総数' },
      { column: 80, name: '居住期間 10～20年未満 男' },
      { column: 81, name: '居住期間 10～20年未満 女' },
      { column: 82, name: '居住期間 20年以上 総数' },
      { column: 83, name: '居住期間 20年以上 男' },
      { column: 84, name: '居住期間 20年以上 女' },
      { column: 85, name: '農林漁業就業者世帯数 一般世帯数' },
      { column: 86, name: '農林漁業・非農林漁業就業者混合世帯数 一般世帯数' },
      { column: 87, name: '非農林漁業就業者世帯数 一般世帯数' },
      { column: 88, name: '非就業者世帯数 一般世帯数' },
      { column: 89, name: '当地に常住する就業者・通学者 総数' },
      { column: 90, name: '当地に常住する就業者・通学者 就業者数' },
      { column: 91, name: '当地に常住する就業者・通学者 通学者数' },
      { column: 92, name: '利用交通手段別自宅外就業者・通学者 徒歩のみ' },
      { column: 93, name: '利用交通手段別自宅外就業者・通学者 鉄道・電車' },
      { column: 94, name: '利用交通手段別自宅外就業者・通学者 乗合バス' },
      { column: 95, name: '利用交通手段別自宅外就業者・通学者 自家用車' },
      { column: 96, name: '利用交通手段別自宅外就業者・通学者 オートバイ' },
      { column: 97, name: '利用交通手段別自宅外就業者・通学者 自転車' }
    ]
  }
]

// prettier-ignore
export const censusDatasetMeshCodes = [
  '3622', '3623', '3624', '3653', '3724', '3725', '3741', '3831', '3926',
  '3927', '3928', '3942', '4027', '4028', '4042', '4128', '4129', '4229',
  '4230', '4329', '4429', '4530', '4531', '4629', '4630', '4631', '4729',
  '4730', '4731', '4828', '4829', '4830', '4831', '4839', '4928', '4929',
  '4930', '4931', '4932', '4933', '4934', '4939', '5029', '5030', '5031',
  '5032', '5033', '5034', '5035', '5036', '5039', '5129', '5130', '5131',
  '5132', '5133', '5134', '5135', '5136', '5137', '5138', '5139', '5229',
  '5231', '5232', '5233', '5234', '5235', '5236', '5237', '5238', '5239',
  '5240', '5332', '5333', '5334', '5335', '5336', '5337', '5338', '5339',
  '5340', '5432', '5433', '5435', '5436', '5437', '5438', '5439', '5440',
  '5536', '5537', '5538', '5539', '5540', '5541', '5636', '5637', '5638',
  '5639', '5640', '5641', '5738', '5739', '5740', '5741', '5839', '5840',
  '5841', '5939', '5940', '5941', '5942', '6039', '6040', '6041', '6139',
  '6140', '6141', '6239', '6240', '6241', '6243', '6339', '6340', '6341',
  '6342', '6343', '6439', '6440', '6441', '6442', '6443', '6444', '6445',
  '6540', '6541', '6542', '6543', '6544', '6545', '6641', '6642', '6643',
  '6644', '6645', '6741', '6742', '6840', '6841', '6842',
]
