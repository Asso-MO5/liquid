import { Navigate } from "@solidjs/router";
import { type VoidComponent } from "solid-js";
import { getBrowserLang } from "~/utils/get-browser-lang";

const Home: VoidComponent = () => (<Navigate href={`/${getBrowserLang()}`} />)

export default Home;