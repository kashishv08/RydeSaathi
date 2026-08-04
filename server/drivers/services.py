from .models import DriverProfile

def submit_dl(driver_profile: DriverProfile, dl_image=None) -> DriverProfile:
    if dl_image is not None:
        driver_profile.dl_image=dl_image
        driver_profile.save(update_fields=["dl_image"])
    return driver_profile