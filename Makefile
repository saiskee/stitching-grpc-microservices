
# initialize image repo env var if it doesn't exist
IMAGE_REPO ?= saiskee

generate_data:
	node review_service/data_gen/generate_reviews.js > review_service/reviews.json
	node product_service/data_gen/generate_products.js > product_service/products.json

# generates proto descriptor binaries for grpc reflection
generate-proto-bins:
	protoc ./review_service/review.proto --proto_path . --descriptor_set_out="./review_service/proto_bin/review.proto.bin" --include_imports 
	protoc ./product_service/product.proto --proto_path . --descriptor_set_out="./product_service/proto_bin/product.proto.bin" --include_imports 
	protoc ./user_service/user.proto --proto_path . --descriptor_set_out="./user_service/proto_bin/user.proto.bin" --include_imports 

copy-utils: 
	cp -r utils ./user_service/utils
	cp -r utils ./product_service/utils
	cp -r utils ./review_service/utils

docker-all: copy-utils generate-proto-bins
	docker build ./user_service -t $(IMAGE_REPO)/user_service
	docker build ./product_service -t $(IMAGE_REPO)/product_service
	docker build ./review_service -t $(IMAGE_REPO)/review_service

docker-push-all: docker-all
	docker push $(IMAGE_REPO)/user_service
	docker push $(IMAGE_REPO)/product_service
	docker push $(IMAGE_REPO)/review_service