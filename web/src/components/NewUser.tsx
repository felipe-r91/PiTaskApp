import { useFormik } from "formik";
import * as Yup from 'yup';
import { ChangeEvent, useState } from "react";
import '../styles/uploadPhoto.css';
import { api } from "../lib/axios";


export function NewUser() {

  const [currentImage, setCurrentImage] = useState<File>();
  const [previewImage, setPreviewImage] = useState<string>('/src/assets/uploads/user.png')
  

  function handleCancel() {
    setCurrentImage(undefined)
    setPreviewImage('')
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
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Deve conter 8 caracteres no mínimo")
        .required('Obrigatório')
        .matches(/(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=]).*$/, "Minúscula, maiúscula, número e caracter especial"),

      confirmPWD: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords não conferem')
        .required('Obrigatório'),

    }),


    onSubmit: function (values) {
      api.post('/profile', {
        name: values.name,
        surname: values.surname,
        password: values.password,
        confirmPWD: values.confirmPWD,
        email: values.email,
        role: values.role,
        photo: values.photo,
      })
      formik.resetForm()
      setCurrentImage(undefined)
      setPreviewImage('')
      alert("Usuário criado com sucesso!")
    }
  })

  return (
    <div className="flex">
      <section className="w-full">
        <div className=" bg-off-white flex flex-col items-center h-screen">
          <div className="w-full h-fit flex items-center">
            <div className="w-fit h-fit text-purple-xdark text-2xl font-bold px-10 py-8">
              Novo Usuário
            </div>
          </div>
          <form onSubmit={formik.handleSubmit} className="w-full flex">
            <div className="grid gap-6 w-[137px] h-fit ml-24 mt-10">
              <div className="w-[137px] h-[137px] border-4 border-[#D9DADE] rounded-full overflow-hidden bg-[#D9DADE] flex items-center justify-center">
                  <img src={previewImage} alt="Foto" />    
              </div>
              <input
                type='file'
                title="avatar"
                onChange={(e) => handleSetImage(e)}
                className='hidden'
                id="photo"
                accept=".jpg, .jpeg, .png"
              />
              <button type="button">
                <label htmlFor="photo" className="uploadPhoto w-[100px] h-[35px]">
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
                    className="text-[#768396] bg-off-white shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[45px] w-[360px] flex-1 items-center justify-center rounded-[4px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
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
                    className="text-[#768396] bg-off-white shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[45px] w-[360px] flex-1 items-center justify-center rounded-[4px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"

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
                    className='text-[#768396] shadow-[#E5E5ED] bg-off-white focus:shadow-purple-light inline-flex h-[45px] w-[360px] flex-1 items-center justify-center rounded-[4px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]'
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
                    className='text-[#768396] shadow-[#E5E5ED] bg-off-white focus:shadow-purple-light inline-flex h-[45px] w-[360px] flex-1 items-center justify-center rounded-[4px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]'
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
                  className="text-[#768396] shadow-[#E5E5ED] bg-off-white focus:shadow-purple-light inline-flex h-[45px] w-[360px] flex-1 items-center justify-center rounded-[4px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
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
                  className="text-[#768396] shadow-[#E5E5ED] bg-off-white focus:shadow-purple-light inline-flex h-[45px] w-[500px] flex-1 items-center justify-center rounded-[4px] px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                  placeholder="Ex. Técnico de Refrigeração"
                  required
                />
              </fieldset>
              <div className="flex pt-72 gap-6 w-full justify-center">
                  <button type="reset" title="cancel" onClick={handleCancel}
                    className='w-20 h-10 rounded-lg border border-[#D9DADE] hover:bg-[#D9DADE] text-black font-semibold text-base flex items-center justify-center'>
                    Cancel
                  </button>
                  <button type="submit" title="save"
                    className='w-20 h-10 rounded-lg bg-purple-light hover:bg-purple-400 text-white font-medium text-base flex items-center justify-center'>
                    Salvar
                  </button>
                </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}


