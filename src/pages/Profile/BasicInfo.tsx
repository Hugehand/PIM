import React from 'react';
import { useProfileStore } from '../../stores/useProfileStore';
import { Input, Label, Button, Card, CardHeader, CardTitle, CardContent } from '../../components/ui';

export const BasicInfo = () => {
  const { profile, updateBasic } = useProfileStore();
  const { basic } = profile;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateBasic({ [name]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>基本信息</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">姓名</Label>
            <Input
              id="name"
              name="name"
              value={basic.name}
              onChange={handleChange}
              placeholder="请输入姓名"
            />
          </div>
          <div>
            <Label htmlFor="gender">性别</Label>
            <Input
              id="gender"
              name="gender"
              value={basic.gender}
              onChange={handleChange}
              placeholder="请输入性别"
            />
          </div>
          <div>
            <Label htmlFor="ethnicity">民族</Label>
            <Input
              id="ethnicity"
              name="ethnicity"
              value={basic.ethnicity || ''}
              onChange={handleChange}
              placeholder="请输入民族"
            />
          </div>
          <div>
            <Label htmlFor="birthDate">出生日期</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              value={basic.birthDate || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="idType">证件类型</Label>
            <Input
              id="idType"
              name="idType"
              value={basic.idType || '身份证'}
              onChange={handleChange}
              placeholder="例如：身份证"
            />
          </div>
          <div>
            <Label htmlFor="idNumber">证件号码</Label>
            <Input
              id="idNumber"
              name="idNumber"
              value={basic.idNumber}
              onChange={handleChange}
              placeholder="请输入证件号码"
            />
          </div>
          <div>
            <Label htmlFor="phone">联系电话</Label>
            <Input
              id="phone"
              name="phone"
              value={basic.phone}
              onChange={handleChange}
              placeholder="请输入手机号"
            />
          </div>
          <div>
            <Label htmlFor="email">电子邮箱</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={basic.email}
              onChange={handleChange}
              placeholder="请输入邮箱"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="address">通讯地址</Label>
            <Input
              id="address"
              name="address"
              value={basic.address}
              onChange={handleChange}
              placeholder="请输入详细地址"
            />
          </div>
           <div className="md:col-span-2">
            <Label htmlFor="householdAddress">户籍地址</Label>
            <Input
              id="householdAddress"
              name="householdAddress"
              value={basic.householdAddress || ''}
              onChange={handleChange}
              placeholder="请输入户籍地址（选填）"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
