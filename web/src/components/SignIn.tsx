import { useFormik } from "formik";
import * as Yup from 'yup';
import { ChangeEvent, useState } from "react";
import '../styles/uploadPhoto.css';
import { api } from "../lib/axios";
import { Logo } from "../assets/Logo1";
import { useNavigate } from "react-router-dom";


export function SignIn() {

  const [currentImage, setCurrentImage] = useState<File>();
  const [previewImage, setPreviewImage] = useState<string>('/src/assets/uploads/user.png')
  const nav = useNavigate()


  function handleCancel() {
    setCurrentImage(undefined)
    setPreviewImage('/src/assets/uploads/user.png')
    formik.resetForm()

  }

  function handleSetImage(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files as FileList
    setCurrentImage(selectedFiles?.[0]);
    setPreviewImage(URL.createObjectURL(selectedFiles?.[0]));
    formik.setFieldValue("photo", selectedFiles?.[0].name, false)
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      password: '',
      confirmPWD: '',
      email: '',
      role: '',
      photo: '',
      phone: ''
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Deve conter 8 caracteres no mínimo")
        .required('Obrigatório')
        .matches(/(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=]).*$/, "Minúscula, maiúscula, número e caracter especial"),

      confirmPWD: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords não conferem')
        .required('Obrigatório'),

      photo: Yup.string()
        .required('Obrigatório escolher uma foto')
    }),


    onSubmit: async function (values) {

      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('surname', values.surname);
        formData.append('password', values.password);
        formData.append('confirmPWD', values.confirmPWD);
        formData.append('email', values.email);
        formData.append('role', values.role);
        formData.append('phone', values.phone);

        if (currentImage) {
          formData.append('photo', currentImage);
        }

        await api.post('/profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        formik.resetForm();
        setCurrentImage(undefined);
        setPreviewImage('/src/assets/uploads/user.png');
        alert("Usuário criado com sucesso!");
        nav('/')
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  })

  return (
    <div className="flex">
      <section className="w-full">
        <div className=" bg-off-white items-center h-screen">
          <div className="w-full h-fit flex items-center">
            <div className="w-fit h-fit text-purple-xdark text-2xl font-bold pl-40 py-8">
              Cadastro de novo Usuário
            </div>
          </div>
          <div className="grid grid-flow-col pt-5">
            <form onSubmit={formik.handleSubmit} className="w-fit flex pl-40">
              <div className="grid gap-6 w-[137px] h-fit mt-10">
                <div className="w-[137px] h-[137px] border-4 border-[#D9DADE] rounded-full overflow-hidden bg-[#D9DADE] flex items-center justify-center">
                  <img src={previewImage} alt="Foto" />
                </div>
                <input
                  type='file'
                  title="avatar"
                  onChange={(e) => { handleSetImage(e); formik.handleChange }}
                  className='hidden'
                  id="photo"
                  accept=".jpg, .jpeg, .png"
                />
                <button type="button" className="w-[150px] h-[35px] bg-[#EDECFE] text-base text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-md ml-[-5px]">
                  <label htmlFor="photo" >
                    Escolha a foto
                  </label>
                </button>
              </div>
              <div className="w-fit h-fit px-14 pt-10 pb-4 flex">
                <div className="flex flex-col gap-8">
                  <fieldset className="grid grid-rows-2 pl-[99px]">
                    <label className="text-purple-dark text-base font-semibold items-center flex w-[360px]" htmlFor="name">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      onChange={formik.handleChange}
                      value={formik.values.name}
                      className="text-[#768396] bg-white shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[45px] w-[360px] flex-1 items-center justify-center rounded-xl px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                      required
                      placeholder="Ex. Paulo"
                    />
                  </fieldset>
                  <fieldset className="grid grid-rows-2 pl-[99px]">
                    <label className="text-purple-dark text-base font-semibold items-center flex w-[360px]" htmlFor="surname">
                      Sobrenome
                    </label>
                    <input
                      type="text"
                      id="surname"
                      onChange={formik.handleChange}
                      value={formik.values.surname}
                      className="text-[#768396] bg-white shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[45px] w-[360px] flex-1 items-center justify-center rounded-xl px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"

                      placeholder="Ex. Silva"
                    />
                  </fieldset>
                  <fieldset className="grid grid-rows-2 pl-[99px]">
                    <label className="text-purple-dark text-base font-semibold items-center flex w-[360px]" htmlFor="password">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className='text-[#768396] shadow-[#E5E5ED] bg-white focus:shadow-purple-light inline-flex h-[45px] w-[360px] flex-1 items-center justify-center rounded-xl px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]'
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      placeholder="8 caracteres, uma maiúscula e um caracter especial"
                      required
                    />
                    {formik.errors.password && formik.touched.password && (
                      <span className="text-red-400">{formik.errors.password}</span>
                    )}
                  </fieldset>
                  <fieldset className="grid grid-rows-2 pl-[99px]">
                    <label className="text-purple-dark text-base font-semibold items-center flex w-[360px]" htmlFor="confirmPWD">
                      Confirme o Password
                    </label>
                    <input
                      type="password"
                      id="confirmPWD"
                      name="confirmPWD"
                      className='text-[#768396] shadow-[#E5E5ED] bg-white focus:shadow-purple-light inline-flex h-[45px] w-[360px] flex-1 items-center justify-center rounded-xl px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]'
                      onChange={formik.handleChange}
                      value={formik.values.confirmPWD}
                      placeholder="Confirme o Password"
                      required
                    />
                    {formik.errors.confirmPWD && formik.touched.confirmPWD && (
                      <span className="text-red-400">{formik.errors.confirmPWD}</span>
                    )}
                  </fieldset>


                </div>
              </div>
              <div className="pt-10 grid gap-8">
                <fieldset className="grid grid-rows-2">
                  <label className="text-purple-dark text-base font-semibold items-center flex w-[360px]" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    className="text-[#768396] shadow-[#E5E5ED] bg-white focus:shadow-purple-light inline-flex h-[45px] w-[360px] flex-1 items-center justify-center rounded-xl px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                    placeholder="example@google.com"
                  />
                </fieldset>
                <fieldset className="grid grid-rows-2">
                  <label className="text-purple-dark text-base font-semibold items-center flex w-[360px]" htmlFor="role">
                    Função
                  </label>
                  <input
                    type="text"
                    id="role"
                    onChange={formik.handleChange}
                    value={formik.values.role}
                    className="text-[#768396] shadow-[#E5E5ED] bg-white focus:shadow-purple-light inline-flex h-[45px] w-[360px] flex-1 items-center justify-center rounded-xl px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                    placeholder="Ex. Técnico de Refrigeração"
                    required
                  />
                </fieldset>
                <fieldset className="grid grid-rows-2">
                  <label className="text-purple-dark text-base font-semibold items-center flex w-[360px]" htmlFor="phone">
                    Telefone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                    className="text-[#768396] shadow-[#E5E5ED] bg-white focus:shadow-purple-light inline-flex h-[45px] w-[360px] flex-1 items-center justify-center rounded-xl px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                    placeholder="Ex. (DDD) 998989087"
                    required
                  />
                </fieldset>
                <div className="flex pt-52 gap-6 w-full justify-center">
                  <button type="reset" title="cancel" onClick={() => {handleCancel; nav('/')}}
                    className='w-20 h-10 rounded-lg bg-[#EDECFE]  text-[#5051F9] hover:bg-[#5051F9] hover:text-white font-medium text-base flex items-center justify-center'>
                    Voltar
                  </button>
                  <button type="submit" title="save"
                    className='w-20 h-10 rounded-lg bg-[#EDECFE]  text-[#5051F9] hover:bg-[#5051F9] hover:text-white font-medium text-base flex items-center justify-center'>
                    Salvar
                  </button>
                </div>
              </div>
            </form>
            <div className="min-w-[100px] h-[100px]">
              <Logo width={100} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


