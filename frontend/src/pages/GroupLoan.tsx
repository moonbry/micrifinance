import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";

function GroupLoan() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fomuNo: "",
    jinaKamiliLaMwombaji: "",
    jinsia: "",
    jinaMaarufu: "",
    ainaYaKitambulisho: "",
    nambaYaKitambulisho: "",
    tareheYaKuzaliwa: "",
    simu: "",
    haliYaNdoa: "",
    eneoUnaioishi: "",
    umeishiHapoTanguLini: "",
    umilikiWaMakazi: "",
    jinaKamiliLaMumeMke: "",
    maarufuMtaani: "",
    tareheYaKuzaliwaMumeMke: "",
    idadiYaUtegemezi: "",
    simuYaMumeMke: "",

    // SEHEMU 2: TAARIFA ZA KIKUNDI
    jinaLaMwenyekiti: "",
    jinaLaKatibu: "",
    anuaniYaMakaziYaKikundi: "",
    nambaYaUsajiliWaKikundi: "",
    mkoa: "",
    wilaya: "",
    kata: "",
    kijijiMtaa: "",
    idadiYaWanachamaMe: "",
    idadiYaWanachamaKe: "",
    mudaKikundiKimekaaKatikaAnuaniHii: "",
    tareheYaUsajiri: "",
    simu1: "",
    simu2: "",
    jinaLaMradi: "",
    ainaYaMradi: "",
    mahaliMradiUpoMkoa: "",
    mahaliMradiUpoKata: "",
    mahaliMradiUpoWilaya: "",
    wastaniWaKipatoKwaMwezi: "",
    wastaniWaMatumiziKwaMwezi: "",
    mradiUmeanzaLini: "",
    kiasiChaMkopo: "",
    mudaWaLipaMkopo: "",
    kiasiGaniChaRejesho: "",
    malengoYaMkopo: "",
    kiasiKikundiKinadaiwa: "",
    kikundiKimewahiKukopa: "",
    chanzoChaMapato: "",
    mdhamini1JinaKamili: "",
    mdhamini1MahaliAnapoishi: "",
    mdhamini1NambaYaNyumba: "",
    mdhamini1AmepangaKwake: "",
    mdhamini1KaziAnayofanya: "",
    mdhamini1MahaliIlipoOfisi: "",
    mdhamini1JinaLaKampuni: "",
    mdhamini1Simu: "",

    // SEHEMU 6: TAARIFA ZA DHAMANA
    dhamanaAinaYaDhamana: "",
    dhamanaNambaYaUsajili: "",
    dhamanaUmiliki: "",
    dhamanaThamaniYakeKwaSasa: "",
    dhamanaUmri: "",
    dhamanaMmilikiWamiliki: "",
    dhamanaRangiMuonekanoWaDhamana: "",
    dhamanaMahaliIlipo: "",
    tamkoLaMwombaji: false,
    tamkoLaMdhaminiUhusiano: "",
    tamkoLaMdhamini: false,
    tamkoLaMdhaminiWajibika: false,
  });

  const steps = [
    "SEHEMU 1: TAARIFA ZA MWOMBAJI",
    "SEHEMU 2: TAARIFA ZA KIKUNDI",
    "SEHEMU 3: TAARIFA ZA MIRADI NA MKOPO",
    "SEHEMU 4: MDHAMINI NA DHAMANA",
    "TAMKO NA WASILISHA"
  ];

  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalTarget(document.getElementById("navbar-portal"));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.tamkoLaMwombaji || !form.tamkoLaMdhamini || !form.tamkoLaMdhaminiWajibika) {
      alert("Tafadhali kubali tamko zote za mwombaji na mdhamini");
      return;
    }

    if (!form.jinaKamiliLaMwombaji || !form.kiasiChaMkopo) {
      alert("Tafadhali jaza jina la mwombaji na kiasi cha mkopo");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post("http://127.0.0.1:8000/api/v1/loans", {
        name: form.jinaKamiliLaMwombaji,
        phone: form.simu,
        amount: form.kiasiChaMkopo,
        type: "group",
        details: form,
      }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

      console.log(res.data);
      alert("✅ OMBI LA MKOPO WA KIKUNDI LIMEWASILISHWA KWA MAFANIKIO!");
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Imeshindwa kuwasilisha ombi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {portalTarget && createPortal(
        <div className="form-portal-content">
          <div className="fomu-no">
            <span style={{ color: '#64748b' }}>Fomu No:</span>
            <input type="text" name="fomuNo" value={form.fomuNo} onChange={handleChange} placeholder="........" className="fomu-no-input" />
          </div>
          <div className="step-indicators">
            {steps.map((_, idx) => (
              <button key={idx} type="button" className={`step-btn ${idx === currentStep ? "active" : ""} ${idx < currentStep ? "completed" : ""}`} onClick={() => idx < currentStep && setCurrentStep(idx)}>
                {idx + 1}
              </button>
            ))}
          </div>
        </div>,
        portalTarget
      )}

      <div className="form-container">
        <div className="step-title">{steps[currentStep]}</div>

        <form onSubmit={handleSubmit}>
          <div className="form-scroll">

            {/* SEHEMU 1: TAARIFA ZA MWOMBAJI */}
            {currentStep === 0 && (
              <div className="form-section">
                <div className="section-divider">SEHEMU 1: TAARIFA ZA MWOMBAJI</div>
                <table className="form-table">
                  <tbody>
                    <tr>
                      <td colSpan={4}><strong>Jina kamili la mwombaji</strong><br /><input type="text" name="jinaKamiliLaMwombaji" value={form.jinaKamiliLaMwombaji} onChange={handleChange} /></td>
                      <td colSpan={2}><strong>Jinsia</strong><br /><select name="jinsia" value={form.jinsia} onChange={handleChange}><option value="">Chagua</option><option>Me</option><option>Ke</option></select></td>
                      <td colSpan={3}><strong>Jina maarufu</strong><br /><input type="text" name="jinaMaarufu" value={form.jinaMaarufu} onChange={handleChange} /></td>
                      <td colSpan={3}><strong>Tarehe ya kuzaliwa</strong><br /><input type="date" name="tareheYaKuzaliwa" value={form.tareheYaKuzaliwa} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Aina ya Kitambulisho</strong><br /><select name="ainaYaKitambulisho" value={form.ainaYaKitambulisho} onChange={handleChange}><option value="">Chagua</option><option>Kitambulisho cha Taifa</option><option>Pasipoti</option><option>Leseni</option></select></td>
                      <td colSpan={4}><strong>Namba ya Kitambulisho</strong><br /><input type="text" name="nambaYaKitambulisho" value={form.nambaYaKitambulisho} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Simu</strong><br /><input type="tel" name="simu" value={form.simu} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Hali ya Ndoa</strong><br /><select name="haliYaNdoa" value={form.haliYaNdoa} onChange={handleChange}><option value="">Chagua</option><option>Hajaoa/Olewa</option><option>Ameoa/Olewa</option><option>Ameachika</option><option>Mjane/Mgane</option></select></td>
                      <td colSpan={6}><strong>Eneo unaioishi</strong><br /><input type="text" name="eneoUnaioishi" value={form.eneoUnaioishi} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Umeishi hapo tangu lini</strong><br /><input type="text" name="umeishiHapoTanguLini" value={form.umeishiHapoTanguLini} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Umiliki wa Makazi</strong><br /><select name="umilikiWaMakazi" value={form.umilikiWaMakazi} onChange={handleChange}><option value="">Chagua</option><option>Kwako</option><option>Umepanga</option><option>Mengine (Eleza)</option></select></td>
                      <td colSpan={4}><strong>Idadi ya utegemezi</strong><br /><input type="number" name="idadiYaUtegemezi" value={form.idadiYaUtegemezi} onChange={handleChange} /></td>
                    </tr>
                    <tr><td colSpan={12} className="sub-header" style={{ background: "#f0f0f0", fontWeight: "bold" }}>TAARIFA ZA MUME/MKE</td></tr>
                    <tr>
                      <td colSpan={4}><strong>Jina kamili la mume/mke</strong><br /><input type="text" name="jinaKamiliLaMumeMke" value={form.jinaKamiliLaMumeMke} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Maarufu mtaani</strong><br /><input type="text" name="maarufuMtaani" value={form.maarufuMtaani} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Simu ya mume/mke</strong><br /><input type="tel" name="simuYaMumeMke" value={form.simuYaMumeMke} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={12}><strong>Tarehe ya kuzaliwa (mume/mke)</strong><br /><input type="date" name="tareheYaKuzaliwaMumeMke" value={form.tareheYaKuzaliwaMumeMke} onChange={handleChange} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 2: TAARIFA ZA KIKUNDI */}
            {/* SEHEMU 2: TAARIFA ZA KIKUNDI */}
            {currentStep === 1 && (
              <div className="form-section">
                <div className="section-divider">SEHEMU 2: TAARIFA ZA KIKUNDI</div>
                <table className="form-table">
                  <tbody>
                    <tr>
                      <td colSpan={6}><strong>Jina la Mwenyekiti</strong><br /><input type="text" name="jinaLaMwenyekiti" value={form.jinaLaMwenyekiti} onChange={handleChange} /></td>
                      <td colSpan={6}><strong>Jina la Katibu</strong><br /><input type="text" name="jinaLaKatibu" value={form.jinaLaKatibu} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={12}><strong>Anuani ya Makazi ya kikundi</strong><br /><input type="text" name="anuaniYaMakaziYaKikundi" value={form.anuaniYaMakaziYaKikundi} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Namba ya usajili wa kikundi</strong><br /><input type="text" name="nambaYaUsajiliWaKikundi" value={form.nambaYaUsajiliWaKikundi} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Mkoa</strong><br /><input type="text" name="mkoa" value={form.mkoa} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Wilaya</strong><br /><input type="text" name="wilaya" value={form.wilaya} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Kata</strong><br /><input type="text" name="kata" value={form.kata} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Kijiji/mtaa</strong><br /><input type="text" name="kijijiMtaa" value={form.kijijiMtaa} onChange={handleChange} /></td>
                      <td colSpan={2}><strong>IDADI (ME)</strong><br /><input type="number" name="idadiYaWanachamaMe" value={form.idadiYaWanachamaMe} onChange={handleChange} /></td>
                      <td colSpan={2}><strong>IDADI (KE)</strong><br /><input type="number" name="idadiYaWanachamaKe" value={form.idadiYaWanachamaKe} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Muda kikundi kimekaa katika Anuani hii</strong><br /><input type="text" name="mudaKikundiKimekaaKatikaAnuaniHii" value={form.mudaKikundiKimekaaKatikaAnuaniHii} onChange={handleChange} /></td>
                      <td colSpan={6}><strong>Tarehe ya usajiri</strong><br /><input type="date" name="tareheYaUsajiri" value={form.tareheYaUsajiri} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Simu 1</strong><br /><input type="tel" name="simu1" value={form.simu1} onChange={handleChange} /></td>
                      <td colSpan={6}><strong>Simu 2</strong><br /><input type="tel" name="simu2" value={form.simu2} onChange={handleChange} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 3: TAARIFA ZA MIRADI + KIASI CHA MKOPO (merged) */}
            {currentStep === 2 && (
              <div className="form-section">
                <div className="section-divider">SEHEMU 3A: TAARIFA ZA MRADI</div>
                <table className="form-table">
                  <tbody>
                    <tr>
                      <td colSpan={4}><strong>Jina la Mradi</strong><br /><input type="text" name="jinaLaMradi" value={form.jinaLaMradi} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Aina ya Mradi</strong><br /><input type="text" name="ainaYaMradi" value={form.ainaYaMradi} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Mahali mradi upo (Wilaya)</strong><br /><input type="text" name="mahaliMradiUpoWilaya" value={form.mahaliMradiUpoWilaya} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Mahali mradi upo (Kata)</strong><br /><input type="text" name="mahaliMradiUpoKata" value={form.mahaliMradiUpoKata} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Wastani wa kipato kwa mwezi</strong><br /><input type="text" name="wastaniWaKipatoKwaMwezi" value={form.wastaniWaKipatoKwaMwezi} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Wastani wa matumizi kwa mwezi</strong><br /><input type="text" name="wastaniWaMatumiziKwaMwezi" value={form.wastaniWaMatumiziKwaMwezi} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={12}><strong>Mradi umeanza lini</strong><br /><input type="text" name="mradiUmeanzaLini" value={form.mradiUmeanzaLini} onChange={handleChange} /></td>
                    </tr>
                  </tbody>
                </table>

                <div className="section-divider" style={{ marginTop: "20px" }}>SEHEMU 3B: KIASI CHA MKOPO</div>
                <table className="form-table">
                  <tbody>
                    <tr>
                      <td colSpan={4}><strong>Kiasi cha Mkopo (TZS)</strong><br /><input type="text" name="kiasiChaMkopo" value={form.kiasiChaMkopo} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Muda wa kulipa Mkopo</strong><br /><input type="text" name="mudaWaLipaMkopo" value={form.mudaWaLipaMkopo} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Kiasi cha rejesho bila matatizo</strong><br /><input type="text" name="kiasiGaniChaRejesho" value={form.kiasiGaniChaRejesho} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Kiasi kikundi kinadaiwa</strong><br /><input type="text" name="kiasiKikundiKinadaiwa" value={form.kiasiKikundiKinadaiwa} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Kikundi kimewahi kukopa?</strong><br />
                        <select name="kikundiKimewahiKukopa" value={form.kikundiKimewahiKukopa} onChange={handleChange}>
                          <option value="">Chagua</option><option value="NDIYO">NDIYO</option><option value="HAPANA">HAPANA</option>
                        </select>
                      </td>
                      <td colSpan={4}><strong>Chanzo cha mapato</strong><br /><input type="text" name="chanzoChaMapato" value={form.chanzoChaMapato} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={12}><strong>Malengo ya Mkopo</strong><br /><textarea name="malengoYaMkopo" rows={2} value={form.malengoYaMkopo} onChange={handleChange}></textarea></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 4: MDHAMINI (MWENYEKITI) + DHAMANA (merged) */}
            {currentStep === 3 && (
              <div className="form-section">
                <div className="section-divider">SEHEMU 4A: MDHAMINI (MWENYEKITI)</div>
                <table className="form-table">
                  <tbody>
                    <tr>
                      <td colSpan={4}><strong>Jina kamili la Mwenyekiti</strong><br /><input type="text" name="mdhamini1JinaKamili" value={form.mdhamini1JinaKamili} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Mahali Anapoishi</strong><br /><input type="text" name="mdhamini1MahaliAnapoishi" value={form.mdhamini1MahaliAnapoishi} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Namba ya nyumba</strong><br /><input type="text" name="mdhamini1NambaYaNyumba" value={form.mdhamini1NambaYaNyumba} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Amepanga kwake</strong><br />
                        <select name="mdhamini1AmepangaKwake" value={form.mdhamini1AmepangaKwake} onChange={handleChange}>
                          <option value="">Chagua</option><option value="Amepanga">Amepanga</option><option value="Kwake">Kwake</option>
                        </select>
                      </td>
                      <td colSpan={4}><strong>Kazi Anayofanya</strong><br /><input type="text" name="mdhamini1KaziAnayofanya" value={form.mdhamini1KaziAnayofanya} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Simu</strong><br /><input type="tel" name="mdhamini1Simu" value={form.mdhamini1Simu} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Mahali ilipo Ofisi</strong><br /><input type="text" name="mdhamini1MahaliIlipoOfisi" value={form.mdhamini1MahaliIlipoOfisi} onChange={handleChange} /></td>
                      <td colSpan={6}><strong>Jina la kampuni/biashara</strong><br /><input type="text" name="mdhamini1JinaLaKampuni" value={form.mdhamini1JinaLaKampuni} onChange={handleChange} /></td>
                    </tr>
                  </tbody>
                </table>

                <div className="section-divider" style={{ marginTop: "20px" }}>SEHEMU 4B: TAARIFA ZA DHAMANA</div>
                <table className="form-table">
                  <tbody>
                    <tr>
                      <td colSpan={4}><strong>Aina ya Dhamana</strong><br /><input type="text" name="dhamanaAinaYaDhamana" value={form.dhamanaAinaYaDhamana} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Namba ya usajili</strong><br /><input type="text" name="dhamanaNambaYaUsajili" value={form.dhamanaNambaYaUsajili} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Umiliki</strong><br /><input type="text" name="dhamanaUmiliki" value={form.dhamanaUmiliki} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Thamani yake kwa sasa</strong><br /><input type="text" name="dhamanaThamaniYakeKwaSasa" value={form.dhamanaThamaniYakeKwaSasa} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Umri</strong><br /><input type="text" name="dhamanaUmri" value={form.dhamanaUmri} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Mmiliki/Wamiliki</strong><br /><input type="text" name="dhamanaMmilikiWamiliki" value={form.dhamanaMmilikiWamiliki} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Rangi/Muonekano wa Dhamana</strong><br /><input type="text" name="dhamanaRangiMuonekanoWaDhamana" value={form.dhamanaRangiMuonekanoWaDhamana} onChange={handleChange} /></td>
                      <td colSpan={6}><strong>Mahali Ilipo</strong><br /><input type="text" name="dhamanaMahaliIlipo" value={form.dhamanaMahaliIlipo} onChange={handleChange} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SEHEMU 5: TAMKO NA WASILISHA */}
            {currentStep === 4 && (
              <div className="tamko-container">
                <div className="tamko-card">
                  <p><strong>TAMKO LA MWOMBAJI</strong><br />Mimi nimeomba mkopo wa Tsh kutoka Orethan Microfinance. Nakiri kwamba taarifa zote nilizozitoa hapo juu ni sahihi kadiri ya ufahamu wangu. Pia nakubali kutembelewa na Afisa mikopo sehemu ya biashara yangu na nyumbani kwangu na kupata taarifa muhimu kutoka kwa watu wengine kwa ajili ya uhakiki wa taarifa zangu kwa matumizi ya ofisi. Pia kwa kujaza fomu hii natoa ridhaa kwa mkopeshaji kutoa taarifa zangu kwenye Taasisi za Kuchakata Taarifa za Wakopaji (CRB) na wadau wengine.</p>
                  <label className="checkbox-label"><input type="checkbox" name="tamkoLaMwombaji" checked={form.tamkoLaMwombaji} onChange={handleChange} /> Ninakubali tamko la mwombaji (Sahihi/Dole Gumba/Tarehe)</label>
                </div>

                <div className="tamko-card">
                  <p><strong>TAMKO LA MDHAMINI - DHAMANA</strong></p>
                  <div className="input-box" style={{ marginBottom: "15px" }}><input type="text" name="tamkoLaMdhaminiUhusiano" placeholder=" " value={form.tamkoLaMdhaminiUhusiano} onChange={handleChange} /><label>Uhusiano wako na mwombaji (Mume/Mke/Ndugu)</label></div>
                  <p>Mimi ninakiri kuwa na taarifa juu ya mkopo wa Tsh uliyoombwa na kutoka Orethan Microfinance. Dhamana tajwa hapo juu nazifahamu na nipo tayari zitolewe kama dhamana kwa mujibu wa masharti na taratibu zilizokubaliwa na mkopaji na mkopeshaji.</p>
                  <label className="checkbox-label"><input type="checkbox" name="tamkoLaMdhamini" checked={form.tamkoLaMdhamini} onChange={handleChange} /> Ninakubali tamko la mdhamini (Sahihi/Dole Gumba/Tarehe)</label>
                </div>

                <div className="tamko-card">
                  <p><strong>TAMKO LA MDHAMINI - KIKUNDI</strong><br />Mimi nakubali kumdhamini aliyeomba mkopo wa Tsh kutoka Orethan Microfinance. Nakiri kwamba taarifa zote nilizozitoa hapo juu ni sahihi kadiri ya ufahamu wangu. Pia, ninatambua na kukubali kwamba nitawajibika kulipa mkopo Pamoja na wajumbe wote wa kikundi endapo mkopaji atashindwa kulipa kama ilivyoainishwa kwenye mkataba.</p>
                  <label className="checkbox-label"><input type="checkbox" name="tamkoLaMdhaminiWajibika" checked={form.tamkoLaMdhaminiWajibika} onChange={handleChange} /> Ninakubali kuwajibika kulipa pamoja na kikundi (Sahihi/Dole Gumba/Tarehe)</label>
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
      </div>

      <style>{`
        .page-container {
          background: #e8f0fe;
          padding: 16px;
          margin-top: -24px; /* Pull up to sit flush with the Navbar */
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          font-family: 'Times New Roman', 'Arial', sans-serif;
        }

        .form-container {
          max-width: 1300px;
          width: 100%;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .form-portal-content {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .fomu-no {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          white-space: nowrap;
          display: flex;
          align-items: center;
        }

        .fomu-no-input {
          width: 130px;
          padding: 6px 10px;
          margin-left: 8px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          color: #0f172a;
          font-weight: normal;
          outline: none;
        }
        .fomu-no-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .step-indicators {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .step-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid #e2e8f0;
          background: white;
          color: #64748b;
          cursor: pointer;
          font-weight: bold;
          font-size: 13px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-btn.completed { background: #22c55e; color: white; border-color: #22c55e; }
        .step-btn.active { background: #1a3a5c; color: white; border-color: #1a3a5c; box-shadow: 0 0 0 3px rgba(26, 58, 92, 0.2); }

        .step-title {
          background: #e0e0e0;
          padding: 8px 20px;
          font-weight: bold;
          font-size: 14px;
          border-bottom: 2px solid #1a3a5c;
        }

        .form-scroll {
          padding: 20px;
          max-height: calc(100vh - 300px);
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
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 10px 0;
          cursor: pointer;
          font-size: 13px;
        }
        
        .input-group {
          position: relative;
          margin: 10px 0;
        }
        
        .input-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 13px;
        }
        
        .input-group label {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: white;
          padding: 0 5px;
          color: #666;
          font-size: 12px;
          transition: 0.2s;
          pointer-events: none;
        }
        
        .input-group input:focus ~ label,
        .input-group input:not(:placeholder-shown) ~ label {
          top: -10px;
          font-size: 10px;
          color: #1a3a5c;
        }
        
        .contact-info {
          margin-top: 20px;
          padding: 10px;
          background: #fef3c7;
          border-radius: 8px;
          text-align: center;
          font-size: 11px;
          color: #92400e;
        }
        
        .tamko-container { display: flex; flex-direction: column; gap: 24px; padding: 10px; }
        .tamko-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          transition: all 0.3s ease;
          border-left: 5px solid #2563eb;
          position: relative;
          overflow: hidden;
        }
        .tamko-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(135deg, rgba(59,130,246,0.05) 0%, transparent 100%);
          pointer-events: none;
        }
        .tamko-card:hover {
          box-shadow: 0 6px 16px rgba(0,0,0,0.06);
          transform: translateY(-2px);
          border-left-color: #1d4ed8;
        }
        .tamko-card p {
          font-size: 14px;
          line-height: 1.6;
          color: #334155;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }
        .tamko-card strong {
          color: #0f172a;
          font-weight: 700;
          background: rgba(59, 130, 246, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          background: white;
          padding: 14px 18px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          transition: all 0.2s;
          position: relative;
          z-index: 1;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .checkbox-label:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }
        .checkbox-label input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: #2563eb;
        }
        
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
        }
        .btn-prev:hover, .btn-next:hover, .btn-submit:hover { opacity: 0.85; transform: translateY(-2px); }
        button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        
        @media (max-width: 800px) {
          .page-container { padding: 10px; margin-top: -24px; border-radius: 0; }
          .form-portal-content { flex-direction: column; align-items: flex-start; gap: 10px; }
          .form-scroll { padding: 12px; max-height: none; }
          .form-table, .form-table tbody, .form-table tr, .form-table td, .form-table th {
            display: block;
            width: 100%;
          }
          .form-table tr {
            margin-bottom: 12px;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 12px;
          }
          .form-table td {
            border: none;
            padding: 4px 0;
            margin-bottom: 8px;
          }
          .btn-prev, .btn-next, .btn-submit { padding: 8px; font-size: 12px; }
          .nav-buttons { flex-direction: column; gap: 8px; }
        }
      `}</style>
    </div>
  );
}

export default GroupLoan;