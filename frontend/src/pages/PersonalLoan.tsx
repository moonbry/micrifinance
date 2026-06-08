import { useState } from "react";
import axios from "axios";

function PersonalLoan() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [passportPhotoPreview, setPassportPhotoPreview] = useState<string>("");

  const [form, setForm] = useState({
    fomuNo: "",
    jinaKamiliMwombaji: "",
    jinsia: "",
    jinaMaarufu: "",
    tareheKuzaliwa: "",
    ainaKitambulisho: "",
    nambaSimu: "",
    nambaKitambulisho: "",
    haliNdoa: "",
    mkoa: "",
    wilaya: "",
    kata: "",
    mtaa: "",
    umilikiMakazi: "",
    umilikiMakaziMengine: "",
    nambaNyumba: "",
    umepanga: "",
    umeishiHapoTanguLini: "",
    jinaKamiliMumeMke: "",
    simuMumeMke: "",
    jinaMaarufuMtaani: "",
    ainaKitambulishoMumeMke: "",
    nambaKitambulishoMumeMke: "",
    kaziMumeMke: "",
    jinaMwajiri: "",
    simuMwajiri: "",
    anuaniEneoKazi: "",
    idadiUtegemezi: "",
    jinaMwajiriKampuni: "",
    mahaliOfisiIlipo: "",
    wadhifaWako: "",
    umefanyaKaziHapoTanguLini: "",
    mshaharaBaadaMakato: "",
    ainaAjira: "",
    tareheKumalizaMkataba: "",
    tareheKustaafu: "",
    jinaBiashara: "",
    ainaBiashara: "",
    mahaliBiasharaIlipo: "",
    umefanyaBiasharaTanguLini: "",
    jinaMmilikiEneoBiashara: "",
    nambaSimuMmilikiEneo: "",
    wastaniKipatoKwaMwezi: "",
    mudaMkatabaEneoBiashara: "",
    wastaniMatumiziKwaMwezi: "",
    kiasiMkopo: "",
    kwaManeno: "",
    mudaKulipaMkopo: "",
    kwaTarakimu: "",
    kiasiRejeshoBilaMatatizo: "",
    malengoMkopo: "",
    chanzoMapato: "",
    historia1JinaTaasisi: "", historia1UlichukuaLini: "", historia1KiasiMkopo: "", historia1KiasiMarejesho: "", historia1TareheMarejesho: "", historia1KiasiKilichobaki: "",
    historia2JinaTaasisi: "", historia2UlichukuaLini: "", historia2KiasiMkopo: "", historia2KiasiMarejesho: "", historia2TareheMarejesho: "", historia2KiasiKilichobaki: "",
    historia3JinaTaasisi: "", historia3UlichukuaLini: "", historia3KiasiMkopo: "", historia3KiasiMarejesho: "", historia3TareheMarejesho: "", historia3KiasiKilichobaki: "",
    dhamanaAina: "", dhamanaNambaUsajili: "", dhamanaUmiliki: "", dhamanaThamaniKwaSasa: "", dhamanaMuonekano: "",
    wdhamini1JinaKamili: "", wdhamini1MahaliAnapoishi: "", wdhamini1AmepangaKwake: "", wdhamini1NambaNyumba: "", wdhamini1KaziAnayofanya: "", wdhamini1UhusianoWenu: "", wdhamini1MahaliOfisiYake: "", wdhamini1JinaKampuniBiashara: "", wdhamini1Simu: "",
    wdhamini2JinaKamili: "", wdhamini2MahaliAnapoishi: "", wdhamini2AmepangaKwake: "", wdhamini2NambaNyumba: "", wdhamini2KaziAnayofanya: "", wdhamini2UhusianoWenu: "", wdhamini2MahaliOfisiYake: "", wdhamini2JinaKampuniBiashara: "", wdhamini2Simu: "",
    tamkoMwombaji: false,
    tamkoMdhamini1: false,
    tamkoMdhamini2: false,
  });

  const steps = [
    "SEHEMU I: TAARIFA ZA MWOMBAJI",
    "SEHEMU 2: TAARIFA ZA AJIRA",
    "SEHEMU 3: TAARIFA ZA BIASHARA",
    "SEHEMU 4: KIASI CHA MKOPO",
    "SEHEMU 5: HISTORIA YA MIKOPO",
    "SEHEMU 6: DHAMANA YA MKOPO",
    "SEHEMU 7: WADHAMINI NO.1",
    "SEHEMU 7: WADHAMINI NO.2",
    "PICHA YA PASSPORT",
    "TAMKO NA WASILISHA"
  ];

  const handlePassportPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Picha ni kubwa mno. Tafadhali tumia picha chini ya 2MB");
        return;
      }
      if (!file.type.includes("image/")) {
        alert("Tafadhali chagua faili ya picha tu (jpg, png, jpeg)");
        return;
      }
      setPassportPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPassportPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadPassportPhoto = async (): Promise<string | null> => {
    if (!passportPhoto) return null;
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("photo", passportPhoto);
      formData.append("applicant_name", form.jinaKamiliMwombaji);
      const res = await axios.post("http://127.0.0.1:8000/api/v1/upload/passport", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: token ? `Bearer ${token}` : "" },
      });
      return res.data.photo_url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const nextStep = () => currentStep < steps.length - 1 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tamkoMwombaji || !form.tamkoMdhamini1 || !form.tamkoMdhamini2) {
      alert("Tafadhali kubali tamko la mwombaji na wadhamini wote wawili");
      return;
    }
    if (!passportPhoto) {
      alert("Tafadhali pakia picha yako ya passport");
      return;
    }

    try {
      setLoading(true);
      let photoUrl = await uploadPassportPhoto() || "";
      const token = localStorage.getItem("token");
      await axios.post("http://127.0.0.1:8000/api/v1/loans", {
        name: form.jinaKamiliMwombaji,
        phone: form.nambaSimu,
        amount: form.kiasiMkopo,
        type: "personal",
        passport_photo: photoUrl,
        details: { ...form, passportPhotoUrl: photoUrl },
      }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      alert("OMBI LA MKOPO LIMEWASILISHWA KWA MAFANIKIO!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Imeshindwa kuwasilisha ombi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <div className="form-header">
          <div className="fomu-no">Fomu No: <input type="text" name="fomuNo" value={form.fomuNo} onChange={handleChange} placeholder="........" className="fomu-no-input" /></div>
          <h1>FOMU YA MAOMBI YA MKOPO BINAFSI</h1>
        </div>

        <div className="step-indicators">
          {steps.map((_, idx) => (
            <button key={idx} className={`step-btn ${idx === currentStep ? "active" : ""} ${idx < currentStep ? "completed" : ""}`} onClick={() => idx < currentStep && setCurrentStep(idx)}>
              {idx + 1}
            </button>
          ))}
        </div>
        <div className="step-title">{steps[currentStep]}</div>

        <form onSubmit={handleSubmit}>
          <div className="form-scroll">
            
            {/* SEHEMU I: TAARIFA ZA MWOMBAJI */}
            {currentStep === 0 && (
              <div className="form-section">
                <table className="form-table">
                  <tbody>
                    <tr>
                      <td colSpan={4}><strong>Jina kamili la mwombaji</strong></td>
                      <td colSpan={2}><strong>Jinsia</strong></td>
                      <td colSpan={4}><strong>Jina maarufu</strong></td>
                      <td colSpan={2}><strong>Tarehe ya kuzaliwa</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><input type="text" name="jinaKamiliMwombaji" value={form.jinaKamiliMwombaji} onChange={handleChange} /></td>
                      <td colSpan={2}>
                        <select name="jinsia" value={form.jinsia} onChange={handleChange}>
                          <option value="">Chagua</option>
                          <option>Me</option>
                          <option>Ke</option>
                        </select>
                      </td>
                      <td colSpan={4}><input type="text" name="jinaMaarufu" value={form.jinaMaarufu} onChange={handleChange} /></td>
                      <td colSpan={2}><input type="date" name="tareheKuzaliwa" value={form.tareheKuzaliwa} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Aina ya kitambulisho</strong></td>
                      <td colSpan={2}><strong>Namba ya Simu</strong></td>
                      <td colSpan={4}><strong>Namba ya kitambulisho</strong></td>
                      <td colSpan={2}><strong>Hali ya ndoa</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        <select name="ainaKitambulisho" value={form.ainaKitambulisho} onChange={handleChange}>
                          <option value="">Chagua</option>
                          <option>Kitambulisho cha Taifa</option>
                          <option>Pasipoti</option>
                          <option>Leseni ya kuendesha</option>
                        </select>
                      </td>
                      <td colSpan={2}><input type="tel" name="nambaSimu" value={form.nambaSimu} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="text" name="nambaKitambulisho" value={form.nambaKitambulisho} onChange={handleChange} /></td>
                      <td colSpan={2}>
                        <select name="haliNdoa" value={form.haliNdoa} onChange={handleChange}>
                          <option value="">Chagua</option>
                          <option>Nimeoa/olewa</option>
                          <option>Sijaoa/olewa</option>
                          <option>Nimeachika</option>
                          <option>Mjane</option>
                        </select>
                      </td>
                    </tr>
                    <tr><td colSpan={12}><strong>Mahali unapoishi</strong></td></tr>
                    <tr>
                      <td colSpan={3}><strong>Mkoa</strong></td>
                      <td colSpan={3}><strong>Wilaya</strong></td>
                      <td colSpan={3}><strong>Kata</strong></td>
                      <td colSpan={3}><strong>Mtaa</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={3}><input type="text" name="mkoa" value={form.mkoa} onChange={handleChange} /></td>
                      <td colSpan={3}><input type="text" name="wilaya" value={form.wilaya} onChange={handleChange} /></td>
                      <td colSpan={3}><input type="text" name="kata" value={form.kata} onChange={handleChange} /></td>
                      <td colSpan={3}><input type="text" name="mtaa" value={form.mtaa} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Umiliki wa makazi</strong></td>
                      <td colSpan={6}><strong>Namba ya nyumba</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={6}>
                        <select name="umilikiMakazi" value={form.umilikiMakazi} onChange={handleChange}>
                          <option value="">Chagua</option>
                          <option>Kwako</option>
                          <option>Mengine (eleza)</option>
                        </select>
                      </td>
                      <td colSpan={6}><input type="text" name="nambaNyumba" value={form.nambaNyumba} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Umpanga</strong></td>
                      <td colSpan={6}><strong>Umeishi hapo tangu lini?</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={6}>
                        <select name="umepanga" value={form.umepanga} onChange={handleChange}>
                          <option value="">Chagua</option>
                          <option>Ndio</option>
                          <option>Hapana</option>
                        </select>
                      </td>
                      <td colSpan={6}><input type="text" name="umeishiHapoTanguLini" value={form.umeishiHapoTanguLini} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Jina kamili la mume/mke</strong></td>
                      <td colSpan={6}><strong>Simu</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><input type="text" name="jinaKamiliMumeMke" value={form.jinaKamiliMumeMke} onChange={handleChange} /></td>
                      <td colSpan={6}><input type="tel" name="simuMumeMke" value={form.simuMumeMke} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Jina maarufu mtaani</strong></td>
                      <td colSpan={6}><strong>Aina ya kitambulisho</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><input type="text" name="jinaMaarufuMtaani" value={form.jinaMaarufuMtaani} onChange={handleChange} /></td>
                      <td colSpan={6}>
                        <select name="ainaKitambulishoMumeMke" value={form.ainaKitambulishoMumeMke} onChange={handleChange}>
                          <option value="">Chagua</option>
                          <option>Kitambulisho cha Taifa</option>
                          <option>Pasipoti</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Namba ya Kitambulisho</strong></td>
                      <td colSpan={6}><strong>Kazi</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><input type="text" name="nambaKitambulishoMumeMke" value={form.nambaKitambulishoMumeMke} onChange={handleChange} /></td>
                      <td colSpan={6}><input type="text" name="kaziMumeMke" value={form.kaziMumeMke} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Jina la mwajiri</strong></td>
                      <td colSpan={6}><strong>Simu</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><input type="text" name="jinaMwajiri" value={form.jinaMwajiri} onChange={handleChange} /></td>
                      <td colSpan={6}><input type="tel" name="simuMwajiri" value={form.simuMwajiri} onChange={handleChange} /></td>
                    </tr>
                    <tr><td colSpan={12}><strong>Anuani ya eneo la kazi</strong></td></tr>
                    <tr><td colSpan={12}><input type="text" name="anuaniEneoKazi" value={form.anuaniEneoKazi} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={12}><strong>Idadi ya utegemezi</strong></td></tr>
                    <tr><td colSpan={12}><input type="text" name="idadiUtegemezi" value={form.idadiUtegemezi} onChange={handleChange} /></td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 2: TAARIFA ZA AJIRA */}
            {currentStep === 1 && (
              <div className="form-section">
                <table className="form-table">
                  <tbody>
                    <tr><td colSpan={6}><strong>Jina la Mwajiri/kampuni</strong></td><td colSpan={6}><strong>Mahali Ofisi ilipo</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="jinaMwajiriKampuni" value={form.jinaMwajiriKampuni} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="mahaliOfisiIlipo" value={form.mahaliOfisiIlipo} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={6}><strong>Wadhifa wako</strong></td><td colSpan={6}><strong>Umefanya kazi hapo toka lini</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="wadhifaWako" value={form.wadhifaWako} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="umefanyaKaziHapoTanguLini" value={form.umefanyaKaziHapoTanguLini} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={6}><strong>Mshahara baada ya makato</strong></td><td colSpan={6}><strong>Aina ya ajira</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="mshaharaBaadaMakato" value={form.mshaharaBaadaMakato} onChange={handleChange} /></td><td colSpan={6}><select name="ainaAjira" value={form.ainaAjira} onChange={handleChange}><option value="">Chagua</option><option>Kudumu</option><option>Mkataba</option><option>Ya muda mfupi</option></select></td></tr>
                    <tr><td colSpan={6}><strong>Tarehe ya kumaliza mkataba</strong></td><td colSpan={6}><strong>Tarehe ya kustaafu</strong></td></tr>
                    <tr><td colSpan={6}><input type="date" name="tareheKumalizaMkataba" value={form.tareheKumalizaMkataba} onChange={handleChange} /></td><td colSpan={6}><input type="date" name="tareheKustaafu" value={form.tareheKustaafu} onChange={handleChange} /></td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 3: TAARIFA ZA BIASHARA */}
            {currentStep === 2 && (
              <div className="form-section">
                <table className="form-table">
                  <tbody>
                    <tr><td colSpan={6}><strong>Jina la Biashara</strong></td><td colSpan={6}><strong>Aina ya Biashara</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="jinaBiashara" value={form.jinaBiashara} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="ainaBiashara" value={form.ainaBiashara} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={12}><strong>Mahali Biashara Ilipo</strong></td></tr>
                    <tr><td colSpan={12}><input type="text" name="mahaliBiasharaIlipo" value={form.mahaliBiasharaIlipo} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={6}><strong>Umefanya Biashara hii tangu lini</strong></td><td colSpan={6}><strong>Jina la mmiliki wa eneo la biashara</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="umefanyaBiasharaTanguLini" value={form.umefanyaBiasharaTanguLini} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="jinaMmilikiEneoBiashara" value={form.jinaMmilikiEneoBiashara} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={6}><strong>Namba zake za simu</strong></td><td colSpan={6}><strong>Wastani wa kipato kwa mwezi</strong></td></tr>
                    <tr><td colSpan={6}><input type="tel" name="nambaSimuMmilikiEneo" value={form.nambaSimuMmilikiEneo} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="wastaniKipatoKwaMwezi" value={form.wastaniKipatoKwaMwezi} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={6}><strong>Muda wa mkataba wa eneo la biashara</strong></td><td colSpan={6}><strong>Wastani wa matumizi kwa mwezi</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="mudaMkatabaEneoBiashara" value={form.mudaMkatabaEneoBiashara} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="wastaniMatumiziKwaMwezi" value={form.wastaniMatumiziKwaMwezi} onChange={handleChange} /></td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 4: KIASI CHA MKOPO */}
            {currentStep === 3 && (
              <div className="form-section">
                <table className="form-table">
                  <tbody>
                    <tr><td colSpan={6}><strong>Kiasi cha Mkopo</strong></td><td colSpan={6}><strong>Kwa maneno</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="kiasiMkopo" value={form.kiasiMkopo} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="kwaManeno" value={form.kwaManeno} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={6}><strong>Muda wa kulipa Mkopo</strong></td><td colSpan={6}><strong>Kwa tarakimu</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="mudaKulipaMkopo" value={form.mudaKulipaMkopo} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="kwaTarakimu" value={form.kwaTarakimu} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={12}><strong>Ni kiasi gani cha rejesho unaweza kulipa bila matatizo?</strong></td></tr>
                    <tr><td colSpan={12}><input type="text" name="kiasiRejeshoBilaMatatizo" value={form.kiasiRejeshoBilaMatatizo} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={12}><strong>Malengo ya Mkopo</strong></td></tr>
                    <tr><td colSpan={12}><textarea name="malengoMkopo" rows={3} value={form.malengoMkopo} onChange={handleChange}></textarea></td></tr>
                    <tr><td colSpan={12}><strong>Chanzo cha Mapato</strong></td></tr>
                    <tr><td colSpan={12}><input type="text" name="chanzoMapato" value={form.chanzoMapato} onChange={handleChange} /></td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 5: HISTORIA YA MIKOPO */}
            {currentStep === 4 && (
              <div className="form-section">
                <table className="form-table history-table">
                  <thead>
                    <tr><th>Jina la Taasisi</th><th>Ulichukua Mkopo lini</th><th>Kiasi cha mkopo</th><th>Kiasi cha marejesho</th><th>Tarehe za marejesho</th><th>Kiasi kilichobaki</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><input type="text" name="historia1JinaTaasisi" value={form.historia1JinaTaasisi} onChange={handleChange} /></td><td><input type="text" name="historia1UlichukuaLini" value={form.historia1UlichukuaLini} onChange={handleChange} /></td><td><input type="text" name="historia1KiasiMkopo" value={form.historia1KiasiMkopo} onChange={handleChange} /></td><td><input type="text" name="historia1KiasiMarejesho" value={form.historia1KiasiMarejesho} onChange={handleChange} /></td><td><input type="text" name="historia1TareheMarejesho" value={form.historia1TareheMarejesho} onChange={handleChange} /></td><td><input type="text" name="historia1KiasiKilichobaki" value={form.historia1KiasiKilichobaki} onChange={handleChange} /></td></tr>
                    <tr><td><input type="text" name="historia2JinaTaasisi" value={form.historia2JinaTaasisi} onChange={handleChange} /></td><td><input type="text" name="historia2UlichukuaLini" value={form.historia2UlichukuaLini} onChange={handleChange} /></td><td><input type="text" name="historia2KiasiMkopo" value={form.historia2KiasiMkopo} onChange={handleChange} /></td><td><input type="text" name="historia2KiasiMarejesho" value={form.historia2KiasiMarejesho} onChange={handleChange} /></td><td><input type="text" name="historia2TareheMarejesho" value={form.historia2TareheMarejesho} onChange={handleChange} /></td><td><input type="text" name="historia2KiasiKilichobaki" value={form.historia2KiasiKilichobaki} onChange={handleChange} /></td></tr>
                    <tr><td><input type="text" name="historia3JinaTaasisi" value={form.historia3JinaTaasisi} onChange={handleChange} /></td><td><input type="text" name="historia3UlichukuaLini" value={form.historia3UlichukuaLini} onChange={handleChange} /></td><td><input type="text" name="historia3KiasiMkopo" value={form.historia3KiasiMkopo} onChange={handleChange} /></td><td><input type="text" name="historia3KiasiMarejesho" value={form.historia3KiasiMarejesho} onChange={handleChange} /></td><td><input type="text" name="historia3TareheMarejesho" value={form.historia3TareheMarejesho} onChange={handleChange} /></td><td><input type="text" name="historia3KiasiKilichobaki" value={form.historia3KiasiKilichobaki} onChange={handleChange} /></td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 6: DHAMANA YA MKOPO */}
            {currentStep === 5 && (
              <div className="form-section">
                <table className="form-table">
                  <tbody>
                    <tr><td colSpan={6}><strong>Aina ya dhamana</strong></td><td colSpan={6}><strong>Namba za usajili</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="dhamanaAina" value={form.dhamanaAina} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="dhamanaNambaUsajili" value={form.dhamanaNambaUsajili} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={6}><strong>Umiliki</strong></td><td colSpan={6}><strong>Thamani yake kwa sasa</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="dhamanaUmiliki" value={form.dhamanaUmiliki} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="dhamanaThamaniKwaSasa" value={form.dhamanaThamaniKwaSasa} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={12}><strong>Muonekano wa dhamana</strong></td></tr>
                    <tr><td colSpan={12}><select name="dhamanaMuonekano" value={form.dhamanaMuonekano} onChange={handleChange}><option value="">Chagua</option><option>Nzuri sana</option><option>Nzuri</option><option>Kuridhisha</option><option>Inahitaji matengenezo</option></select></td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 7: WADHAMINI NO.1 */}
            {currentStep === 6 && (
              <div className="form-section">
                <h3>NO. 1</h3>
                <table className="form-table">
                  <tbody>
                    <tr><td colSpan={4}><strong>Jina kamili la Mdhamini</strong></td><td colSpan={4}><strong>Mahali Anapoishi</strong></td><td colSpan={4}><strong>Amepanga/ kwake</strong></td></tr>
                    <tr><td colSpan={4}><input type="text" name="wdhamini1JinaKamili" value={form.wdhamini1JinaKamili} onChange={handleChange} /></td><td colSpan={4}><input type="text" name="wdhamini1MahaliAnapoishi" value={form.wdhamini1MahaliAnapoishi} onChange={handleChange} /></td><td colSpan={4}><select name="wdhamini1AmepangaKwake" value={form.wdhamini1AmepangaKwake} onChange={handleChange}><option value="">Chagua</option><option>Amepanga</option><option>Kwake</option></select></td></tr>
                    <tr><td colSpan={4}><strong>Namba ya nyumba</strong></td><td colSpan={4}><strong>Kazi Anayofanya</strong></td><td colSpan={4}><strong>Uhusiano wenu</strong></td></tr>
                    <tr><td colSpan={4}><input type="text" name="wdhamini1NambaNyumba" value={form.wdhamini1NambaNyumba} onChange={handleChange} /></td><td colSpan={4}><input type="text" name="wdhamini1KaziAnayofanya" value={form.wdhamini1KaziAnayofanya} onChange={handleChange} /></td><td colSpan={4}><input type="text" name="wdhamini1UhusianoWenu" value={form.wdhamini1UhusianoWenu} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={4}><strong>Mahali ilipo Ofisi yake</strong></td><td colSpan={4}><strong>Jina la kampuni/ biashara</strong></td><td colSpan={4}><strong>Simu</strong></td></tr>
                    <tr>
                      <td colSpan={4}><input type="text" name="wdhamini1MahaliOfisiYake" value={form.wdhamini1MahaliOfisiYake} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="text" name="wdhamini1JinaKampuniBiashara" value={form.wdhamini1JinaKampuniBiashara} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="tel" name="wdhamini1Simu" value={form.wdhamini1Simu} onChange={handleChange} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 7: WADHAMINI NO.2 */}
            {currentStep === 7 && (
              <div className="form-section">
                <h3>NO. 2</h3>
                <table className="form-table">
                  <tbody>
                    <tr><td colSpan={4}><strong>Jina kamili la Mdhamini</strong></td><td colSpan={4}><strong>Mahali Anapoishi</strong></td><td colSpan={4}><strong>Amepanga/ kwake</strong></td></tr>
                    <tr><td colSpan={4}><input type="text" name="wdhamini2JinaKamili" value={form.wdhamini2JinaKamili} onChange={handleChange} /></td><td colSpan={4}><input type="text" name="wdhamini2MahaliAnapoishi" value={form.wdhamini2MahaliAnapoishi} onChange={handleChange} /></td><td colSpan={4}><select name="wdhamini2AmepangaKwake" value={form.wdhamini2AmepangaKwake} onChange={handleChange}><option value="">Chagua</option><option>Amepanga</option><option>Kwake</option></select></td></tr>
                    <tr><td colSpan={4}><strong>Namba ya nyumba</strong></td><td colSpan={4}><strong>Kazi Anayofanya</strong></td><td colSpan={4}><strong>Uhusiano wenu</strong></td></tr>
                    <tr><td colSpan={4}><input type="text" name="wdhamini2NambaNyumba" value={form.wdhamini2NambaNyumba} onChange={handleChange} /></td><td colSpan={4}><input type="text" name="wdhamini2KaziAnayofanya" value={form.wdhamini2KaziAnayofanya} onChange={handleChange} /></td><td colSpan={4}><input type="text" name="wdhamini2UhusianoWenu" value={form.wdhamini2UhusianoWenu} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={4}><strong>Mahali ilipo Ofisi yake</strong></td><td colSpan={4}><strong>Jina la kampuni/ biashara</strong></td><td colSpan={4}><strong>Simu</strong></td></tr>
                    <tr>
                      <td colSpan={4}><input type="text" name="wdhamini2MahaliOfisiYake" value={form.wdhamini2MahaliOfisiYake} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="text" name="wdhamini2JinaKampuniBiashara" value={form.wdhamini2JinaKampuniBiashara} onChange={handleChange} /></td>
                      <td colSpan={4}><input type="tel" name="wdhamini2Simu" value={form.wdhamini2Simu} onChange={handleChange} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* PICHA YA PASSPORT */}
            {currentStep === 8 && (
              <div className="form-section passport-section">
                <div className="passport-upload">
                  <div className="passport-preview">
                    {passportPhotoPreview ? (
                      <img src={passportPhotoPreview} alt="Passport" />
                    ) : (
                      <div className="preview-placeholder">PICHA YAKO HAPA</div>
                    )}
                  </div>
                  <div className="upload-controls">
                    <label className="upload-btn">
                      CHAGUA PICHA YA PASSPORT
                      <input type="file" accept="image/*" onChange={handlePassportPhotoChange} hidden />
                    </label>
                    {passportPhoto && (
                      <p>Imechaguliwa: {passportPhoto.name}</p>
                    )}
                    <div className="upload-note">
                      <p>Maelekezo:</p>
                      <p>- Picha iwe ya hivi karibuni (ndani ya miezi 6)</p>
                      <p>- Usuli wa picha uwe mweupe au bluu</p>
                      <p>- Ukubwa: Passport size (2x2 inches)</p>
                      <p>- Umbizo: JPG, PNG (Max 2MB)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAMKO NA WASILISHA */}
            {currentStep === 9 && (
              <div className="form-section tamko-section">
                <div className="tamko-content">
                  <p><strong>Mimi</strong> nimeomba mkopo wa Tsh kutoka Orethan Microfinance. Nakiri kwamba taarifa zote nilizozitoa hapo juu ni sahihi kadiri ya ufahamu wangu. Nakubali kutembelewa na Afisa mikopo sehemu ya biashara yangu na nyumbani kwangu na kupata taarifa muhimu kutoka kwa watu wengine kwa ajili ya uhakiki wa taarifa zangu.</p>
                  <p>Pia Kwa kujaza fomu hii natoa ridhaa kwa mkopeshaji kutoa taarifa zangu kwenye Taasisi za Kuchakata Taarifa za Wakopaji (CRB) na wadau wengine kama ilivyoanishwa kwenye sheria na miongozo inayotolewa na Benki Kuu Ya Tanzania pamoja na Tume ya Ulinzi wa Taarifa Binafsi.</p>
                  <div className="tamko-line">SAHIHI _______________ TAREHE _______________ DOLE GUMBA _______________</div>
                  
                  <h4>TAMKO LA WADHAMINI</h4>
                  <p><strong>1.</strong> Mimi nakubali kumdhamini aliyeomba mkopo wa Tsh kutoka Orethan Microfinance. Nakiri kwamba taarifa zote nilizozitoa hapo juu ni sahihi kadiri ya ufahamu wangu. Pia natambua kuwa nitawajibika kulipa mkopo huu kama ikitokea mwombaji ameshindwa kulipa kwa wakati sawa sawa na mkataba wa mkopo huu.</p>
                  <div className="tamko-line">SAHIHI _______________ TAREHE _______________ DOLE GUMBA _______________</div>
                  
                  <p><strong>2.</strong> Mimi nakubali kumdhamini aliyeomba mkopo wa Tsh kutoka Orethan Microfinance. Nakiri kwamba taarifa zote nilizozitoa hapo juu ni sahihi kadiri ya ufahamu wangu. Pia natambua kuwa nitawajibika kulipa mkopo huu kama ikitokea mwombaji ameshindwa kulipa kwa wakati sawa sawa na mkataba wa mkopo huu.</p>
                  <div className="tamko-line">SAHIHI _______________ TAREHE _______________ DOLE GUMBA _______________</div>
                  
                  <div className="tamko-checkboxes">
                    <label><input type="checkbox" name="tamkoMwombaji" checked={form.tamkoMwombaji} onChange={handleChange} /> Ninakubali Tamko la Mwombaji</label>
                    <label><input type="checkbox" name="tamkoMdhamini1" checked={form.tamkoMdhamini1} onChange={handleChange} /> Ninakubali Tamko la Mdhamini 1</label>
                    <label><input type="checkbox" name="tamkoMdhamini2" checked={form.tamkoMdhamini2} onChange={handleChange} /> Ninakubali Tamko la Mdhamini 2</label>
                  </div>
                  
                  <div className="contact-info">
                    <p>NB: KWA CHANGAMOTO AMA MALALAMIKO USISITE KUTUPIGIA KUPITIA Tel No: +255 769337774 or +255 702 519 104.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="nav-buttons">
            {currentStep > 0 && (
              <button type="button" className="btn-prev" onClick={prevStep}>◄ NYUMA</button>
            )}
            {currentStep < steps.length - 1 ? (
              <button type="button" className="btn-next" onClick={nextStep}>ENDELEA ►</button>
            ) : (
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "INAWASILISHA..." : "WASILISHA OMBI"}
              </button>
            )}
          </div>
        </form>
        
        <div className="footer">
          <p>© 2026 Orethan Microfinance. Haki zote zimehifadhiwa.</p>
        </div>
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .page-container {
          min-height: 100vh;
          background: #e8f0fe;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Times New Roman', 'Arial', sans-serif;
        }
        
        .form-container {
          max-width: 1300px;
          width: 100%;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .form-header {
          background: #1a3a5c;
          padding: 12px 20px;
          text-align: center;
          color: white;
        }
        
        .fomu-no {
          text-align: right;
          margin-bottom: 8px;
          font-size: 13px;
        }
        
        .fomu-no-input {
          width: 120px;
          padding: 4px 8px;
          margin-left: 10px;
          border: 1px solid #ccc;
          border-radius: 2px;
        }
        
        .form-header h1 {
          font-size: 18px;
          letter-spacing: 1px;
        }
        
        .step-indicators {
          display: flex;
          gap: 5px;
          padding: 10px 20px;
          background: #f5f5f5;
          border-bottom: 1px solid #ddd;
          flex-wrap: wrap;
        }
        
        .step-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #ccc;
          background: white;
          cursor: pointer;
          font-weight: bold;
          font-size: 12px;
        }
        
        .step-btn.active {
          background: #1a3a5c;
          color: white;
          border-color: #1a3a5c;
        }
        
        .step-btn.completed {
          background: #2e7d32;
          color: white;
          border-color: #2e7d32;
        }
        
        .step-title {
          background: #e0e0e0;
          padding: 8px 20px;
          font-weight: bold;
          font-size: 14px;
          border-bottom: 2px solid #1a3a5c;
        }
        
        .form-scroll {
          padding: 20px;
          max-height: 60vh;
          overflow-y: auto;
        }
        
        .form-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        
        .form-table td, .form-table th {
          border: 1px solid #ddd;
          padding: 6px;
          vertical-align: top;
          font-size: 13px;
        }
        
        .form-table th {
          background: #f0f0f0;
          font-weight: bold;
          text-align: center;
        }
        
        .form-table input, .form-table select, .form-table textarea {
          width: 100%;
          padding: 5px;
          border: 1px solid #ccc;
          border-radius: 2px;
          font-family: inherit;
          font-size: 12px;
        }
        
        .form-table textarea {
          resize: vertical;
        }
        
        .history-table th, .history-table td {
          padding: 4px;
        }
        
        .history-table input {
          min-width: 80px;
        }
        
        .form-section h3 {
          background: #e0e0e0;
          padding: 5px 10px;
          margin-bottom: 10px;
          font-size: 14px;
        }
        
        .passport-section {
          padding: 20px;
        }
        
        .passport-upload {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
          align-items: flex-start;
        }
        
        .passport-preview {
          width: 150px;
          height: 170px;
          border: 2px solid #ccc;
          background: #f9f9f9;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .passport-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .preview-placeholder {
          text-align: center;
          color: #999;
          font-size: 11px;
        }
        
        .upload-controls {
          flex: 1;
          min-width: 220px;
        }
        
        .upload-btn {
          display: inline-block;
          background: #1a3a5c;
          color: white;
          padding: 8px 16px;
          cursor: pointer;
          border-radius: 2px;
          margin-bottom: 8px;
          font-size: 12px;
        }
        
        .upload-note {
          margin-top: 10px;
          padding: 8px;
          background: #f5f5f5;
          font-size: 11px;
        }
        
        .upload-note p {
          margin: 2px 0;
        }
        
        .tamko-section {
          padding: 20px;
        }
        
        .tamko-content p {
          margin-bottom: 12px;
          line-height: 1.5;
          text-align: justify;
          font-size: 12px;
        }
        
        .tamko-line {
          margin: 12px 0;
          padding: 4px;
          border-bottom: 1px dotted #999;
        }
        
        .tamko-content h4 {
          margin: 15px 0 8px 0;
          font-size: 14px;
        }
        
        .tamko-checkboxes {
          margin: 15px 0;
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }
        
        .tamko-checkboxes label {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 12px;
        }
        
        .contact-info {
          margin-top: 15px;
          padding: 8px;
          background: #f0f0f0;
          text-align: center;
          font-size: 11px;
        }
        
        /* BUTTONS - ZITAONEKANA VIZURI CHINI */
        .nav-buttons {
          display: flex;
          gap: 15px;
          padding: 15px 20px;
          background: #ffffff;
          border-top: 2px solid #1a3a5c;
        }
        
        .btn-prev {
          flex: 1;
          padding: 12px 20px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          font-size: 15px;
          border-radius: 8px;
          background: #6c757d;
          color: white;
          transition: all 0.3s ease;
        }
        
        .btn-next {
          flex: 1;
          padding: 12px 20px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          font-size: 15px;
          border-radius: 8px;
          background: #28a745;
          color: white;
          transition: all 0.3s ease;
        }
        
        .btn-submit {
          flex: 1;
          padding: 12px 20px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          font-size: 15px;
          border-radius: 8px;
          background: #007bff;
          color: white;
          transition: all 0.3s ease;
        }
        
        .btn-prev:hover, .btn-next:hover, .btn-submit:hover {
          opacity: 0.85;
          transform: translateY(-2px);
        }
        
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .footer {
          text-align: center;
          padding: 8px;
          background: #f5f5f5;
          font-size: 10px;
          color: #666;
          border-top: 1px solid #ddd;
        }
        
        @media (max-width: 800px) {
          .page-container { padding: 10px; }
          .form-scroll { padding: 12px; max-height: 50vh; }
          .form-table td, .form-table th { padding: 3px; font-size: 11px; }
          .history-table { display: block; overflow-x: auto; }
          .btn-prev, .btn-next, .btn-submit { padding: 8px 12px; font-size: 13px; }
        }
      `}</style>
    </div>
  );
}

export default PersonalLoan;